import { PlayerVehicle, Prisma } from '@prisma/client';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { joaat } from '../../shared/joaat';
import { FDO, JobPermission, JobType } from '../../shared/job';
import { PlayerData } from '../../shared/player';
import { toVector3Object, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { getRandomItem } from '../../shared/random';
import { Err, isErr, Ok, Result } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import {
    Garage,
    GarageCategory,
    GarageType,
    GarageVehicle,
    getTransferPrice,
    HouseGarageLimits,
    PlaceCapacity,
} from '../../shared/vehicle/garage';
import { getDefaultVehicleConfiguration } from '../../shared/vehicle/modification';
import { PlayerServerVehicle, PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import { getDefaultVehicleCondition, VehicleCategory } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { HousingProvider } from '../housing/housing.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { JobService } from '../job.service';
import { LockService } from '../lock.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerCriminalService } from '../player/player.criminal.service';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { GarageRepository } from '../repository/garage.repository';
import { HousingRepository } from '../repository/housing.repository';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleSpawner } from './vehicle.spawner';
import { VehicleStateService } from './vehicle.state.service';

const ALLOWED_VEHICLE_TYPE: Record<GarageCategory, string[]> = {
    [GarageCategory.Car]: ['automobile', 'bike', 'trailer'],
    [GarageCategory.Air]: ['heli', 'plane'],
    [GarageCategory.Sea]: ['boat', 'submarine'],
    [GarageCategory.All]: ['automobile', 'bike', 'plane', 'heli', 'boat'],
};

const FORMAT_LOCALIZED: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'CET',
};

const PRIVATE_GARAGE_MAX_PLACES = 60;

@Provider()
export class VehicleGarageProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(LockService)
    private lockService: LockService;

    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(PlayerCriminalService)
    private playerCriminalService: PlayerCriminalService;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(HousingProvider)
    private housingProvider: HousingProvider;

    @Once(OnceStep.RepositoriesLoaded)
    public async init(): Promise<void> {
        const queries = `
            UPDATE player_vehicles SET state = 1, garage = 'airport_public' WHERE state = 0 AND job IS NULL AND category = 'car';
            UPDATE player_vehicles SET state = 3, garage = job WHERE state = 0 AND job IS NOT NULL AND category = 'car';
            UPDATE player_vehicles SET state = 1, garage = 'airport_air' WHERE state = 0 AND job IS NULL AND category = 'air';
            UPDATE player_vehicles SET state = 3, garage = concat(job,'_air') WHERE state = 0 AND job IS NOT NULL AND category = 'air';
            UPDATE player_vehicles SET state = 1, garage = 'docks_boat' WHERE state = 0 AND category = 'Boats';
            UPDATE player_vehicles SET garage = 'mtp' WHERE garage = 'oil';
            UPDATE player_vehicles SET garage = 'stonk' WHERE garage = 'cash-transfer';
            UPDATE player_vehicles SET garage = 'pound' WHERE state = 2 AND garage != 'pound';

            UPDATE vehicles v SET v.stock = v.maxStock - (SELECT COUNT(1) FROM player_vehicles pv WHERE pv.vehicle = v.model AND pv.state != 5 AND pv.citizenid IS NOT NULL);
            UPDATE vehicles v SET v.stock = 0 WHERE v.stock < 0;
        `
            .split(';')
            .filter(s => s.trim().length > 0);

        for (const query of queries) {
            await this.prismaService.$executeRawUnsafe(query);
        }

        const vehicles = await this.prismaService.playerVehicle.findMany({
            where: {
                state: {
                    in: [
                        PlayerVehicleState.InGarage,
                        PlayerVehicleState.InPound,
                        PlayerVehicleState.InSoftPound,
                        PlayerVehicleState.InFedPound,
                        PlayerVehicleState.Missing,
                    ],
                },
            },
        });

        const garages = await this.garageRepository.get();
        const toPound = [];
        const toVoid = [];

        for (const vehicle of vehicles) {
            const parkingTime = new Date(vehicle.parkingtime * 1000);
            const days = (Date.now() - parkingTime.getTime()) / (1000 * 60 * 60 * 24);

            let garageId = vehicle.garage;

            if (garageId && garageId.startsWith('property_')) {
                garageId = garageId.substring(9);
            }

            if (garageId && garageId.startsWith('apartment_')) {
                const apartmentIdentifier = garageId.substring(10);
                const apartment = await this.housingRepository.getApartmentByIdentifier(apartmentIdentifier);

                if (apartment) {
                    const property = await this.housingRepository.find(apartment.propertyId);

                    if (property) {
                        garageId = property.identifier;
                    }
                }
            }

            const garage = garageId
                ? garages[garageId] || Object.values(garages).find(g => g.legacyId === garageId)
                : null;

            if (!garage && vehicle.state !== PlayerVehicleState.Missing) {
                toPound.push(vehicle.id);
            } else if (vehicle.state === PlayerVehicleState.Missing && days > 2) {
                toVoid.push(vehicle.id);
            } else if (garage && garage.type === GarageType.Depot && days > 7) {
                toVoid.push(vehicle.id);
            } else if ((!garage || garage.type !== GarageType.Job) && days > 21) {
                toPound.push(vehicle.id);
            }
        }

        if (toVoid.length) {
            await this.prismaService.playerVehicle.updateMany({
                where: {
                    id: { in: toVoid },
                },
                data: {
                    state: PlayerVehicleState.Destroyed,
                    parkingtime: Math.round(Date.now() / 1000),
                },
            });
        }

        if (toPound.length) {
            await this.prismaService.playerVehicle.updateMany({
                where: {
                    id: { in: toPound },
                },
                data: {
                    state: PlayerVehicleState.InPound,
                    garage: 'pound',
                    parkingtime: Math.round(Date.now() / 1000),
                },
            });
        }

        const playerVehicles = await this.prismaService.playerVehicle.findMany();

        for (const v of playerVehicles) {
            const hash = joaat(v.vehicle.toLowerCase());
            const currentHash = parseInt(v.hash, 10);

            if (hash !== currentHash) {
                await this.prismaService.playerVehicle.update({
                    where: {
                        id: v.id,
                    },
                    data: {
                        hash: hash.toString(),
                    },
                });
            }
        }

        const vehicleData = await this.prismaService.vehicle.findMany();

        for (const v of vehicleData) {
            const hash = joaat(v.model.toLowerCase());
            const currentHash = v.hash;

            if (hash !== currentHash) {
                await this.prismaService.vehicle.update({
                    where: {
                        model: v.model,
                    },
                    data: {
                        hash: hash,
                    },
                });
            }
        }
    }

    @Rpc(RpcServerEvent.VEHICLE_GARAGE_GET_MAX_PLACES)
    public async getMaxPlaces(source: number, garage: Garage): Promise<number | null> {
        if (garage.type !== GarageType.Private && garage.type !== GarageType.House) {
            return null;
        }

        if (garage.type === GarageType.House && garage.isTrailerGarage) {
            return 1;
        }

        if (garage.type === GarageType.House) {
            const player = this.playerService.getPlayer(source);

            if (!player || !player.apartment || !player.apartment.id) {
                return 0;
            }

            const [, apartment] = await this.housingRepository.getApartment(
                player.apartment.property_id,
                player.apartment.id
            );

            if (!apartment) {
                return 0;
            }

            return HouseGarageLimits[apartment.tier ?? 0] ?? 0;
        }

        return 60;
    }

    @Rpc(RpcServerEvent.VEHICLE_GARAGE_GET_PLACES)
    public async getPrivatePlaces(source: number, id: string, garage: Garage): Promise<[number | null, number | null]> {
        if (garage.type !== GarageType.Private) {
            return [null, null];
        }

        const ids = [id];

        if (garage.legacyId) {
            ids.push(garage.legacyId);
        }

        const count = await this.prismaService.playerVehicle.count({
            where: {
                garage: { in: ids },
                state: {
                    in: [PlayerVehicleState.InGarage, PlayerVehicleState.InJobGarage],
                },
            },
        });

        return [Math.max(0, PRIVATE_GARAGE_MAX_PLACES - count), PRIVATE_GARAGE_MAX_PLACES];
    }

    @Rpc(RpcServerEvent.VEHICLE_GARAGE_GET_PROPERTY_PLACES)
    public async getPropertyPlaces(
        source: number,
        id: string,
        garage: Garage,
        apartmentIdentifiers: string[]
    ): Promise<Record<string, [number | null, number | null]>> {
        if (garage.type !== GarageType.House) {
            return {};
        }

        const result = {};
        const ids = [];

        for (const apartmentIdentifier of apartmentIdentifiers) {
            ids.push(`apartment_${apartmentIdentifier}`);

            result[`apartment_${apartmentIdentifier}`] = await this.getApartmentPlace(
                `apartment_${apartmentIdentifier}`,
                garage,
                0
            );
        }

        const countByGarage = await this.prismaService.playerVehicle.groupBy({
            _count: true,
            where: {
                garage: { in: ids },
                state: {
                    in: [PlayerVehicleState.InGarage, PlayerVehicleState.InJobGarage],
                },
            },
            by: ['garage'],
        });

        for (const count of countByGarage) {
            if (!count.garage.startsWith('apartment_')) {
                result[count.garage] = [Math.max(0, HouseGarageLimits[0] - count._count), HouseGarageLimits[0]];

                continue;
            }

            result[count.garage] = await this.getApartmentPlace(count.garage, garage, count._count);
        }

        return result;
    }

    private async getApartmentPlace(garageId: string, garage: Garage, count: number | null = null) {
        if (count === null) {
            count = await this.prismaService.playerVehicle.count({
                where: {
                    garage: garageId,
                    state: {
                        in: [PlayerVehicleState.InGarage, PlayerVehicleState.InJobGarage],
                    },
                },
            });
        }

        const apartmentIdentifier = garageId.substring(10);
        const apartment = await this.housingRepository.getApartmentByIdentifier(apartmentIdentifier);

        let maxPlaces = HouseGarageLimits[0] ?? 0;

        if (apartment) {
            maxPlaces = HouseGarageLimits[apartment.tier ?? 0] ?? 0;
        }

        if (garage.type === GarageType.House && garage.isTrailerGarage) {
            maxPlaces = 1;
        }

        return [Math.max(0, maxPlaces - count), maxPlaces];
    }

    private getPermissionForGarage(type: GarageType, category: GarageCategory): JobPermission {
        if (type == GarageType.Depot) {
            return JobPermission.SocietyTakeOutPound;
        }
        if (type == GarageType.Public) {
            if (category == GarageCategory.Sea) {
                return JobPermission.SocietyPublicPort;
            } else {
                return JobPermission.SocietyPublicGarage;
            }
        } else {
            if (category == GarageCategory.Sea) {
                return JobPermission.SocietyPrivatePort;
            } else {
                return JobPermission.SocietyPrivateGarage;
            }
        }
        return null;
    }

    @Rpc(RpcServerEvent.VEHICLE_GARAGE_GET_VEHICLES)
    public async getGarageVehicles(source: number, id: string): Promise<GarageVehicle[]> {
        const garage =
            (await this.garageRepository.get())[id] ||
            ({
                category: GarageCategory.All,
                id: id,
                name: id,
                type: GarageType.Public,
            } as Garage);

        const player = this.playerService.getPlayer(source);

        if (!player) {
            return [];
        }

        const ids = [];

        if (this.playerCriminalService.isCriminal(player.citizenid)) {
            this.notifier.notify(source, 'Vous devez attendre après avoir réalisé une action criminelle', 'error');

            return null;
        }

        if (garage.type === GarageType.House) {
            ids.push(`property_${id}`);

            const property = await this.housingRepository.getPropertyByIdentifier(id);

            if (property) {
                for (const apartment of property.apartments) {
                    ids.push(`apartment_${apartment.identifier}`);
                }
            }
        } else {
            ids.push(id);
        }

        if (garage.legacyId) {
            ids.push(garage.legacyId);
        }

        if (garage.type === GarageType.Job && garage.job !== player.job.id) {
            return [];
        }

        const where: Prisma.PlayerVehicleWhereInput = {
            AND: [
                {
                    garage: { in: ids },
                    state: {
                        in: [
                            PlayerVehicleState.InGarage,
                            PlayerVehicleState.InPound,
                            PlayerVehicleState.InJobGarage,
                            PlayerVehicleState.InSoftPound,
                            PlayerVehicleState.InFedPound,
                        ],
                    },
                },
            ],
        };

        if (garage.type === GarageType.House) {
            // all vehicle from the current player in any of the ids
            const or = [{ citizenid: player.citizenid }] as Array<Prisma.PlayerVehicleWhereInput>;
            const property = await this.housingRepository.getPropertyByIdentifier(id);

            if (property) {
                for (const apartment of property.apartments) {
                    if (await this.housingProvider.hasAccessToApartment(player, apartment.identifier)) {
                        // or any vehicle from apartment where player has access
                        or.push({ garage: `apartment_${apartment.identifier}` });
                    }
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            where.AND.push({ OR: or });
        }

        if (
            garage.type === GarageType.Depot ||
            garage.type === GarageType.Public ||
            garage.type === GarageType.Private
        ) {
            const or = [{ citizenid: player.citizenid, job: null }] as Array<Prisma.PlayerVehicleWhereInput>;

            const permission = this.getPermissionForGarage(garage.type, garage.category);

            if (
                permission &&
                (await this.jobService.hasPermission(player, player.job.id, permission)) &&
                player.job.onduty
            ) {
                or.push({ job: player.job.id });
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            where.AND.push({ OR: or });
        }

        const playerVehicles = await this.prismaService.playerVehicle.findMany({
            where,
        });

        const vehicles = await this.prismaService.vehicle.findMany({
            where: {
                model: {
                    in: playerVehicles.map(v => v.vehicle),
                },
            },
        });

        const vehiclesByModel = {};

        for (const vehicle of vehicles) {
            vehiclesByModel[vehicle.model] = vehicle;
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const playerVehiclesMapped = [];

        for (const vehicle of playerVehicles) {
            const playerVehicle = {
                id: vehicle.id,
                label: vehicle.label,
                license: vehicle.license,
                citizenid: vehicle.citizenid,
                model: parseInt(vehicle.hash || '0', 10),
                modelName: vehicle.vehicle,
                modification: vehicle.mods ? JSON.parse(vehicle.mods) : getDefaultVehicleConfiguration(),
                condition: vehicle.condition ? JSON.parse(vehicle.condition) : getDefaultVehicleCondition(),
                plate: vehicle.plate,
                garage: vehicle.garage,
                job: vehicle.job as JobType,
                category: vehicle.category as VehicleCategory,
                state: vehicle.state,
            } as PlayerServerVehicle;
            let price: number | null = null;

            if (garage.type === GarageType.Depot) {
                const vehiclePrice = (await this.vehicleRepository.findByHash(parseInt(vehicle.hash)))?.price || 0;
                if (vehicle.state == PlayerVehicleState.InSoftPound) {
                    const hours = (timestamp - vehicle.parkingtime) / 3600;
                    if (hours > 1) {
                        price = Math.round(vehiclePrice * 0.15);
                    } else if (hours > 0.5) {
                        price = Math.round(vehiclePrice * 0.1);
                    } else {
                        price = Math.round(vehiclePrice * 0.05);
                    }
                } else if (vehicle.state == PlayerVehicleState.InFedPound) {
                    price = vehicle.pound_price;
                } else {
                    price = Math.round(vehiclePrice * 0.15);
                }
            }

            if (garage.type === GarageType.Private) {
                const hours = Math.floor((timestamp - vehicle.parkingtime) / 3600);
                price = Math.min(200, hours * 20);
            }

            playerVehiclesMapped.push({
                vehicle: playerVehicle,
                price,
                weight: await this.inventoryManager.getVehicleStorageWeight(playerVehicle.plate),
                name: vehiclesByModel[playerVehicle.modelName]?.name || null,
            } as GarageVehicle);
        }

        return playerVehiclesMapped;
    }

    private async checkCanManageVehicle(
        player: PlayerData,
        id: string,
        garage: Garage,
        vehicleId: number
    ): Promise<Result<PlayerVehicle, string>> {
        const vehicle = await this.prismaService.playerVehicle.findUnique({
            where: { id: vehicleId },
        });

        if (!vehicle) {
            return Err("ce véhicule n'existe pas");
        }

        const citizenIds = await this.getCitizenIdsForGarage(player, garage, id);

        if (
            (garage.type === GarageType.Private ||
                garage.type === GarageType.Public ||
                garage.type === GarageType.House) &&
            !vehicle.job &&
            !citizenIds.has(vehicle.citizenid)
        ) {
            return Err("ce véhicule n'est pas à vous");
        } else if (
            (garage.type === GarageType.Private || garage.type === GarageType.Public) &&
            vehicle.job &&
            !(await this.jobService.hasPermission(
                player,
                player.job.id,
                this.getPermissionForGarage(garage.type, garage.category)
            ))
        ) {
            return Err("vous n'avez pas la permission de ranger un véhicule entreprise dans un garage publique/privé");
        } else if (
            (garage.type === GarageType.Private || garage.type === GarageType.Public) &&
            vehicle.job &&
            (await this.jobService.hasPermission(
                player,
                player.job.id,
                this.getPermissionForGarage(garage.type, garage.category)
            )) &&
            !player.job.onduty
        ) {
            return Err("vous n'êtes pas en service pour ranger un véhicule entrprise");
        } else if (garage.type === GarageType.Job && garage.job !== player.job.id) {
            return Err("vous n'avez pas accès à ce garage entreprise");
        } else if (
            garage.type === GarageType.Depot &&
            player.job.id !== JobType.Bennys &&
            !FDO.includes(player.job.id)
        ) {
            return Err("vous n'avez pas accès à ce garage fourrière");
        } else if (
            garage.type === GarageType.JobLuxury &&
            (garage.job !== player.job.id || (!vehicle.plate.startsWith('LUXE') && !vehicle.plate.startsWith('ESSAI')))
        ) {
            return Err("vous n'avez pas accès à ce garage luxe ou ce véhicule n'est pas un véhicule de luxe");
        } else if (garage.type === GarageType.House && vehicle.job !== null) {
            return Err('ce véhicule appartient à une entreprise');
        }

        return Ok(vehicle);
    }

    @OnEvent(ServerEvent.VEHICLE_GARAGE_RENAME)
    public async renameGarage(
        source: number,
        id: string,
        garage: Garage,
        vehicleId: number,
        name: string
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const vehicle = await this.checkCanManageVehicle(player, id, garage, vehicleId);

        if (isErr(vehicle)) {
            this.notifier.notify(source, `Vous ne pouvez pas renommer ce véhicule: ${vehicle.err}.`, 'error');

            return;
        }

        await this.prismaService.playerVehicle.update({
            where: { id: vehicle.ok.id },
            data: {
                label: name,
            },
        });

        this.notifier.notify(source, `Le véhicule a été renommé en : ${name}.`, 'error');
    }

    @OnEvent(ServerEvent.VEHICLE_GARAGE_STORE)
    public async storeVehicle(
        source: number,
        id: string,
        garage: Garage,
        vehicleNetworkId: number,
        delay: number,
        cost: number
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const vehicleState = this.vehicleStateService.getVehicleState(vehicleNetworkId);

        if (!vehicleState.volatile.id) {
            if (garage.type === GarageType.Depot) {
                if (await this.vehicleSpawner.delete(vehicleNetworkId)) {
                    this.notifier.notify(source, 'Le véhicule a été mis en fourrière.', 'success');

                    return;
                }
            }

            this.notifier.notify(source, 'Ce véhicule ne vous appartient pas.', 'error');

            return;
        }

        const vehicleType = GetVehicleType(vehicleEntityId);

        if (!ALLOWED_VEHICLE_TYPE[garage.category].includes(vehicleType)) {
            this.notifier.notify(
                source,
                `Vous ne pouvez pas ranger ce véhicule dans le garage ${garage.name}.`,
                'error'
            );

            return;
        }

        let apartmentIdentifier = id;

        if (apartmentIdentifier.startsWith('apartment_')) {
            apartmentIdentifier = apartmentIdentifier.substring(10);
        }

        const hasApartmentAccess =
            garage.type === GarageType.House &&
            (await this.housingProvider.hasAccessToApartment(player, apartmentIdentifier));

        let vehicle: PlayerVehicle | null = null;

        if (!hasApartmentAccess) {
            const vehicleResult = await this.checkCanManageVehicle(player, id, garage, vehicleState.volatile.id);

            if (isErr(vehicleResult)) {
                this.notifier.notify(
                    source,
                    `Vous ne pouvez pas ranger ce véhicule dans le garage ${garage.name}: ${vehicleResult.err}.`,
                    'error'
                );

                return;
            }

            vehicle = vehicleResult.ok;
        } else {
            vehicle = await this.prismaService.playerVehicle.findUnique({
                where: { id: vehicleState.volatile.id },
            });
        }

        if (garage.type === GarageType.House) {
            id = `apartment_${id}`;
        }

        const [freePlaces, maxPlaces] =
            garage.type === GarageType.House
                ? await this.getApartmentPlace(id, garage)
                : await this.getPrivatePlaces(source, id, garage);

        if (freePlaces !== null && freePlaces <= 0 && id != `property_cayo_villa`) {
            this.notifier.notify(source, `Ce garage est plein, les ${maxPlaces} places sont occupés.`, 'error');

            return;
        }

        let state = PlayerVehicleState.InGarage;
        if (garage.type === GarageType.Depot) {
            if (player.job.id == JobType.Bennys) {
                state = PlayerVehicleState.InPound;
            } else if (FDO.includes(player.job.id)) {
                state = PlayerVehicleState.InFedPound;
            }
        }

        if (await this.vehicleSpawner.delete(vehicleNetworkId)) {
            this.monitor.publish(
                'vehicle_garage_in',
                {
                    player_source: source,
                    vehicle_plate: vehicle.plate,
                },
                {
                    garage: id,
                    garage_type: garage.type,
                    condition: vehicleState.condition,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                    state: state,
                    delay: delay,
                    pound_price: cost,
                }
            );

            // Only sync if vehicle was in correct state otherwise, do not update
            if (vehicle.state === PlayerVehicleState.Out) {
                await this.prismaService.playerVehicle.update({
                    where: { id: vehicle.id },
                    data: {
                        state: state,
                        condition: JSON.stringify(vehicleState.condition),
                        garage: id,
                        parkingtime: Math.floor(Date.now() / 1000) + delay * 3600,
                        pound_price: cost,
                    },
                });
            }

            if (garage.type === GarageType.Depot) {
                this.notifier.notify(source, 'Le véhicule a été mis en fourrière.', 'success');
            } else {
                this.notifier.notify(source, 'Le véhicule a été rangé dans le garage.', 'success');
            }
        } else {
            this.monitor.publish(
                'vehicle_garage_error_in',
                {
                    player_source: source,
                    vehicle_plate: vehicle.plate,
                },
                {
                    garage: id,
                    garage_type: garage.type,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                    state: state,
                    delay: delay,
                    pound_price: cost,
                }
            );
            this.notifier.notify(source, '~r~ERREUR~s~ du rangement du véhicule.', 'error');
        }
    }

    @OnEvent(ServerEvent.VEHICLE_GARAGE_RETRIEVE)
    public async takeOutVehicle(
        source: number,
        id: string,
        garage: Garage,
        vehicleId: number,
        use_ticket: boolean
    ): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (use_ticket && !this.inventoryManager.hasEnoughItem(source, 'parking_ticket_fake', 1, true)) {
            this.notifier.notify(source, "Vous n'avez pas de ticket de parking.", 'error');

            return;
        }

        await this.lockService.lock(
            `vehicle:${vehicleId}`,
            async () => {
                const playerVehicle = await this.prismaService.playerVehicle.findUnique({
                    where: { id: vehicleId },
                });

                if (!playerVehicle) {
                    this.notifier.notify(source, "Ce véhicule n'existe pas", 'error');

                    return;
                }

                const vehicle = await this.vehicleRepository.findByModel(playerVehicle.vehicle);
                const capacity = vehicle ? vehicle.size : PlaceCapacity.Small;
                const vehiclePrice = vehicle ? vehicle.price : 0;
                let apartmentIdentifier = playerVehicle.garage;

                if (apartmentIdentifier && apartmentIdentifier.startsWith('apartment_')) {
                    apartmentIdentifier = apartmentIdentifier.substring(10);
                }

                const hasApartmentAccess =
                    garage.type === GarageType.House &&
                    (await this.housingProvider.hasAccessToApartment(player, apartmentIdentifier));

                const citizenIds = await this.getCitizenIdsForGarage(player, garage, id);

                if (!hasApartmentAccess && !citizenIds.has(playerVehicle.citizenid)) {
                    if (
                        !playerVehicle.job &&
                        (garage.type === GarageType.Private || garage.type === GarageType.House)
                    ) {
                        this.notifier.notify(source, 'Ce véhicule ne vous appartient pas.', 'error');

                        return;
                    }

                    if (
                        (garage.type === GarageType.Job || garage.type === GarageType.JobLuxury) &&
                        player.job.id !== garage.job
                    ) {
                        this.notifier.notify(source, 'Vous ne pouvez pas sortir un véhicule de ce garage.', 'error');

                        return;
                    }

                    const permission = this.getPermissionForGarage(garage.type, garage.category);

                    if (
                        (garage.type === GarageType.Private ||
                            garage.type === GarageType.Public ||
                            garage.type === GarageType.Depot) &&
                        (playerVehicle.job !== player.job.id ||
                            !(await this.jobService.hasPermission(player, player.job.id, permission)) ||
                            !player.job.onduty)
                    ) {
                        this.notifier.notify(source, "Vous n'avez pas l'autorisation de sortir ce véhicule.", 'error');

                        return;
                    }
                }

                // Simplify here, in the long term we should check if the vehicle is in the garage only (other state will be deleted)
                if (
                    playerVehicle.state !== PlayerVehicleState.InGarage &&
                    playerVehicle.state !== PlayerVehicleState.InJobGarage &&
                    playerVehicle.state !== PlayerVehicleState.InPound &&
                    playerVehicle.state !== PlayerVehicleState.InSoftPound &&
                    playerVehicle.state !== PlayerVehicleState.InFedPound
                ) {
                    this.notifier.notify(source, 'Ce véhicule est déjà sorti.', 'error');

                    return;
                }

                const parkingPlaces = garage.parkingPlaces.filter(place => {
                    const placeCapacities = place.data?.capacity || [PlaceCapacity.Small];

                    return placeCapacities.includes(capacity);
                });

                if (parkingPlaces.length === 0) {
                    this.notifier.notify(source, 'Aucune place de parking disponible.', 'error');

                    return;
                }

                const parkingPlace = getRandomItem(parkingPlaces);

                let price = 0;
                const timestamp = Math.floor(Date.now() / 1000);

                if (garage.type === GarageType.Depot) {
                    if (playerVehicle.state == PlayerVehicleState.InSoftPound) {
                        const hours = (timestamp - playerVehicle.parkingtime) / 3600;
                        if (hours > 1) {
                            price = Math.round(vehiclePrice * 0.15);
                        } else if (hours > 0.5) {
                            price = Math.round(vehiclePrice * 0.1);
                        } else {
                            price = Math.round(vehiclePrice * 0.05);
                        }
                    } else if (playerVehicle.state == PlayerVehicleState.InFedPound) {
                        if (playerVehicle.parkingtime > timestamp) {
                            this.notifier.notify(
                                source,
                                `Ce véhicule est immobilisé jusqu'au ${new Date(
                                    playerVehicle.parkingtime * 1000
                                ).toLocaleDateString('fr-FR', FORMAT_LOCALIZED)}`,
                                'error'
                            );

                            return;
                        }
                        price = playerVehicle.pound_price;
                    } else {
                        price = Math.round(vehiclePrice * 0.15);
                    }
                }

                if (garage.type === GarageType.Private) {
                    const hours = Math.floor((timestamp - playerVehicle.parkingtime) / 3600);
                    price = Math.min(200, hours * 20);
                }

                if (!use_ticket && price !== 0 && !this.playerMoneyService.remove(source, price)) {
                    this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');

                    return;
                }

                if (!use_ticket && price !== 0) {
                    this.monitor.publish(
                        'pay_vehicle_garage_fee',
                        {
                            player_source: source,
                            vehicle_plate: playerVehicle.plate,
                            garage: id,
                        },
                        {
                            price,
                        }
                    );
                }

                if (!use_ticket && price !== 0 && garage.type === GarageType.Depot) {
                    const bennysFee = Math.round(vehicle.price * 0.02);
                    await this.playerMoneyService.transfer('farm_bennys', 'safe_bennys', bennysFee);

                    this.monitor.publish(
                        'pay_vehicle_impound_fee',
                        {
                            player_source: source,
                            vehicle_plate: playerVehicle.plate,
                            garage: id,
                        },
                        {
                            price: bennysFee,
                        }
                    );
                }

                const spawnedVehicleId = await this.vehicleSpawner.spawnPlayerVehicle(source, playerVehicle, [
                    ...parkingPlace.center,
                    parkingPlace.heading || 0,
                ] as Vector4);

                if (spawnedVehicleId !== null) {
                    await this.prismaService.playerVehicle.update({
                        where: { id: playerVehicle.id },
                        data: {
                            state: PlayerVehicleState.Out,
                        },
                    });

                    this.vehicleStateService.addVehicleKey(playerVehicle.plate, player.citizenid);

                    this.monitor.publish(
                        'vehicle_garage_out',
                        {
                            player_source: source,
                            vehicle_plate: playerVehicle.plate,
                        },
                        {
                            garage: id,
                            garage_type: garage.type,
                            price,
                            condition: JSON.parse(playerVehicle.condition),
                            position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                        }
                    );

                    this.notifier.notify(source, 'Vous avez sorti votre véhicule.', 'success');

                    if (use_ticket) {
                        this.inventoryManager.removeItemFromInventory(source, 'parking_ticket_fake', 1);
                    }
                } else {
                    this.notifier.notify(
                        source,
                        'Une erreur est survenue lors du spawn du véhicule, veuillez ressayer.',
                        'error'
                    );

                    if (!use_ticket && price !== 0) {
                        this.playerMoneyService.add(source, price);
                    }
                }
            },
            1000
        );
    }

    @OnEvent(ServerEvent.VEHICLE_GARAGE_TRANSFER)
    public async transferVehicleToGarage(source: number, id: number, from: Garage, to: Garage) {
        if (!from.transferList || !from.transferList.includes(to.id)) {
            this.notifier.notify(source, 'Vous ne pouvez pas transférer ce véhicule dans ce garage.', 'error');

            return;
        }

        const playerVehicle = await this.prismaService.playerVehicle.findFirst({
            where: { id },
        });

        if (!playerVehicle || (playerVehicle.garage !== from.id && playerVehicle.garage !== from.legacyId)) {
            this.notifier.notify(source, "Ce véhicule n'est pas disponible.", 'error');

            return;
        }

        const weight = await this.inventoryManager.getVehicleStorageWeight(playerVehicle.plate);
        const transferPrice = getTransferPrice(weight);

        if (!this.playerMoneyService.remove(source, transferPrice)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');

            return;
        }

        await this.prismaService.playerVehicle.update({
            where: { id },
            data: {
                garage: to.id,
            },
        });

        this.notifier.notify(source, `Vous avez transféré votre véhicule pour ${transferPrice}$.`, 'success');
    }

    @Tick(TickInterval.EVERY_MINUTE, 'soft-pound-check')
    public async loop() {
        const softVehicles = await this.prismaService.playerVehicle.findMany({
            where: { state: PlayerVehicleState.InSoftPound },
        });

        const timestamp = Math.floor(Date.now() / 1000);

        const loseLifeDelay = 3600;
        let waitTime = loseLifeDelay;
        for (const veh of softVehicles) {
            const delta = timestamp - (veh.parkingtime + loseLifeDelay);
            if (delta > 0) {
                const newState = veh.life_counter == 0 ? PlayerVehicleState.Missing : PlayerVehicleState.InPound;
                await this.prismaService.playerVehicle.update({
                    where: { id: veh.id },
                    data: {
                        state: newState,
                        life_counter: {
                            decrement: 1,
                        },
                    },
                });
                this.monitor.publish(
                    'vehicle_softpound_lifelost',
                    {
                        player_source: source,
                        vehicle_plate: veh.plate,
                    },
                    {
                        life_counter_before: veh.life_counter,
                        life_counter_after: veh.life_counter - 1,
                        state: newState,
                    }
                );
            } else {
                waitTime = Math.min(waitTime, -delta);
            }
        }

        await wait(waitTime * 1000);
    }

    private async getCitizenIdsForGarage(player: PlayerData, garage: Garage, propertyId: string): Promise<Set<string>> {
        const citizenIds = new Set<string>();

        citizenIds.add(player.citizenid);

        if (garage.type === GarageType.House) {
            const property = await this.housingRepository.getPropertyByIdentifier(propertyId);
            const apartment = await this.housingRepository.getApartmentByIdentifier(propertyId);

            if (apartment) {
                if (apartment.owner === player.citizenid || apartment.roommate === player.citizenid) {
                    // or any vehicle from apartment owned by the player
                    citizenIds.add(apartment.owner);

                    if (apartment.roommate) {
                        citizenIds.add(apartment.roommate);
                    }
                }
            }

            if (property) {
                const apartments = property.apartments.filter(
                    a => a.owner === player.citizenid || a.roommate === player.citizenid
                );

                for (const apartment of apartments) {
                    citizenIds.add(apartment.owner);

                    if (apartment.roommate) {
                        citizenIds.add(apartment.roommate);
                    }
                }
            }
        }

        return citizenIds;
    }
}

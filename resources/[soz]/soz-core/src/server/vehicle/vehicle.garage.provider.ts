import { PlayerVehicle, Prisma } from '@prisma/client';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { JobPermission, JobType } from '../../shared/job';
import { Monitor } from '../../shared/monitor';
import { PlayerData } from '../../shared/player';
import { toVector3Object, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { getRandomItem } from '../../shared/random';
import { Err, isErr, Ok, Result } from '../../shared/result';
import { RpcEvent } from '../../shared/rpc';
import { Garage, GarageType, GarageVehicle, PlaceCapacity } from '../../shared/vehicle/garage';
import { getDefaultVehicleConfiguration } from '../../shared/vehicle/modification';
import { PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import { getDefaultVehicleCondition, VehicleCategory } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { JobService } from '../job.service';
import { LockService } from '../lock.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { GarageRepository } from '../repository/garage.repository';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleSpawner } from './vehicle.spawner';
import { VehicleStateService } from './vehicle.state.service';

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

    @Inject(Monitor)
    private monitor: Monitor;

    @Once(OnceStep.DatabaseConnected)
    public async init(): Promise<void> {
        const queries = `
            UPDATE player_vehicles SET state = 1, garage = 'airportpublic' WHERE state = 0 AND job IS NULL AND category = 'car';
            UPDATE player_vehicles SET state = 3, garage = job WHERE state = 0 AND job IS NOT NULL AND category = 'car';
            UPDATE player_vehicles SET state = 1, garage = 'airport_air' WHERE state = 0 AND job IS NULL AND category = 'air';
            UPDATE player_vehicles SET state = 3, garage = concat(job,'_air') WHERE state = 0 AND job IS NOT NULL AND category = 'air';
            UPDATE player_vehicles SET garage = 'mtp' WHERE garage = 'oil';
            UPDATE player_vehicles SET garage = 'stonk' WHERE garage = 'cash-transfer';
            UPDATE player_vehicles SET garage = 'pound' WHERE state = 2 AND garage != 'pound';

            UPDATE vehicles v SET v.stock = 8 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Compacts';
            UPDATE vehicles v SET v.stock = 6 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Coupes';
            UPDATE vehicles v SET v.stock = 3 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Muscle';
            UPDATE vehicles v SET v.stock = 4 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Suvs';
            UPDATE vehicles v SET v.stock = 6 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Vans';
            UPDATE vehicles v SET v.stock = 4 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Off-road';
            UPDATE vehicles v SET v.stock = 6 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Sedans';
            UPDATE vehicles v SET v.stock = 6 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Motorcycles';
            UPDATE vehicles v SET v.stock = 3 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Helicopters';
            UPDATE vehicles v SET v.stock = 99 - (SELECT COUNT(1) as taken FROM player_vehicles WHERE player_vehicles.vehicle = v.model AND player_vehicles.state != 5)  WHERE v.category = 'Cycles';
            UPDATE vehicles v SET v.stock = 0 WHERE v.stock < 0;
        `
            .split(';')
            .filter(s => s.trim().length > 0);

        for (const query of queries) {
            await this.prismaService.$executeRawUnsafe(query);
        }

        const vehicles = await this.prismaService.playerVehicle.findMany({
            where: {
                state: { in: [PlayerVehicleState.InGarage, PlayerVehicleState.InPound, PlayerVehicleState.Missing] },
            },
        });

        const garages = await this.garageRepository.refresh();
        const toPound = [];
        const toVoid = [];

        for (const vehicle of vehicles) {
            const parkingTime = new Date(vehicle.parkingtime * 1000);
            const days = (Date.now() - parkingTime.getTime()) / (1000 * 60 * 60 * 24);

            let garageId = vehicle.garage;

            if (garageId && garageId.startsWith('property_')) {
                garageId = garageId.substring(9);
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
    }

    @Rpc(RpcEvent.VEHICLE_GARAGE_GET_MAX_PLACES)
    public async getMaxPlaces(source: number, garage: Garage): Promise<number | null> {
        if (garage.type !== GarageType.Private && garage.type !== GarageType.House) {
            return null;
        }

        const player = this.playerService.getPlayer(source);
        const isPropertyGarage = garage.type === GarageType.House;

        if (isPropertyGarage) {
            if (!player) {
                return 0;
            }
            const playerApartmentTier = player.apartment?.tier ?? -1
            return 1 + playerApartmentTier
        }

        return 38
    }

    @Rpc(RpcEvent.VEHICLE_GARAGE_GET_FREE_PLACES)
    public async getFreePlaces(source: number, id: string, garage: Garage): Promise<number | null> {
        if (garage.type !== GarageType.Private && garage.type !== GarageType.House) {
            return null;
        }

        const player = this.playerService.getPlayer(source);
        const isPropertyGarage = garage.type === GarageType.House;

        if (isPropertyGarage && !id.startsWith('property_')) {
            id = `property_${id}`;
        }

        const ids = [id];

        if (garage.legacyId) {
            ids.push(garage.legacyId);
        }

        const count = await this.prismaService.playerVehicle.count({
            where: {
                garage: { in: ids },
                citizenid: isPropertyGarage ? { equals: player.citizenid } : undefined,
                state: isPropertyGarage ? 1 : undefined,
            },
        });

        const maxPlaces = await this.getMaxPlaces(source, garage);

        return Math.max(0, maxPlaces - count);
    }

    @Rpc(RpcEvent.VEHICLE_GARAGE_GET_VEHICLES)
    public async getGarageVehicles(source: number, id: string, garage: Garage): Promise<GarageVehicle[]> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return [];
        }

        const ids = [];

        if (garage.type === GarageType.House) {
            ids.push(`property_${id}`);
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
                        in: [PlayerVehicleState.InGarage, PlayerVehicleState.InPound, PlayerVehicleState.InJobGarage],
                    },
                },
            ],
        };

        if (garage.type === GarageType.House) {
            const citizenIds = await this.getCitizenIdsForGarage(player, garage, id);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            where.AND.push({ citizenid: { in: [...citizenIds] } });
        }

        if (
            garage.type === GarageType.Depot ||
            garage.type === GarageType.Public ||
            garage.type === GarageType.Private
        ) {
            const or = [{ citizenid: player.citizenid, job: null }] as Array<Prisma.PlayerVehicleWhereInput>;

            if (
                garage.type !== GarageType.Private &&
                this.jobService.hasPermission(player, player.job.id, JobPermission.SocietyTakeOutPound)
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
            };

            let price: number | null = null;

            if (garage.type === GarageType.Depot) {
                const vehiclePrice = (await this.vehicleRepository.findByModel(playerVehicle.modelName))?.price || 0;

                price = Math.round(vehiclePrice * 0.15);
            }

            if (garage.type === GarageType.Private) {
                const hours = Math.floor((timestamp - vehicle.parkingtime) / 3600);
                price = Math.min(200, hours * 20);
            }

            playerVehiclesMapped.push({
                vehicle: playerVehicle,
                price,
                name: null,
            });
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
            !citizenIds.has(vehicle.citizenid)
        ) {
            return Err("ce véhicule n'est pas à vous");
        } else if (garage.type === GarageType.Job && garage.job !== player.job.id) {
            return Err("vous n'avez pas accès à ce garage entreprise");
        } else if (garage.type === GarageType.Depot && player.job.id !== JobType.Bennys) {
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
    public async storeVehicle(source: number, id: string, garage: Garage, vehicleNetworkId: number): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const vehicleState = this.vehicleStateService.getVehicleState(vehicleEntityId);

        if (!vehicleState.id) {
            if (garage.type === GarageType.Depot) {
                if (await this.vehicleSpawner.delete(vehicleNetworkId)) {
                    this.notifier.notify(source, 'Le véhicule a été mis en fourrière.', 'success');

                    return;
                }
            }

            this.notifier.notify(source, 'Ce véhicule ne vous appartient pas.', 'error');

            return;
        }

        const vehicle = await this.checkCanManageVehicle(player, id, garage, vehicleState.id);

        if (isErr(vehicle)) {
            this.notifier.notify(
                source,
                `Vous ne pouvez pas ranger ce véhicule dans le garage ${garage.name}: ${vehicle.err}.`,
                'error'
            );

            return;
        }

        if (garage.type === GarageType.House) {
            id = `property_${id}`;
        }

        const freePlaces = await this.getFreePlaces(source, id, garage);

        if (freePlaces !== null && freePlaces <= 0) {
            this.notifier.notify(source, 'Ce garage est plein.', 'error');

            return;
        }

        if (await this.vehicleSpawner.delete(vehicleNetworkId)) {
            this.monitor.publish(
                'vehicle_garage_in',
                {
                    player_source: source,
                    vehicle_plate: vehicle.ok.plate,
                },
                {
                    garage: id,
                    garage_type: garage.type,
                    condition: vehicleState.condition,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                }
            );

            // Only sync if vehicle was in correct state otherwise, do not update
            if (vehicle.ok.state === PlayerVehicleState.Out) {
                await this.prismaService.playerVehicle.update({
                    where: { id: vehicle.ok.id },
                    data: {
                        state: PlayerVehicleState.InGarage,
                        condition: JSON.stringify(vehicleState.condition),
                        garage: id,
                        parkingtime: Math.floor(Date.now() / 1000),
                    },
                });
            }

            if (garage.type === GarageType.Depot) {
                this.notifier.notify(source, 'Le véhicule a été mis en fourrière.', 'success');
            } else {
                this.notifier.notify(source, 'Le véhicule a été rangé dans le garage.', 'success');
            }
        }
    }

    @OnEvent(ServerEvent.VEHICLE_GARAGE_RETRIEVE)
    public async takeOutVehicle(source: number, id: string, garage: Garage, vehicleId: number): Promise<void> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
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

                const citizenIds = await this.getCitizenIdsForGarage(player, garage, id);

                if (!citizenIds.has(playerVehicle.citizenid)) {
                    if (garage.type === GarageType.Private || garage.type === GarageType.House) {
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

                    if (
                        (garage.type === GarageType.Depot || garage.type === GarageType.Public) &&
                        (playerVehicle.job !== player.job.id ||
                            !this.jobService.hasPermission(player, player.job.id, JobPermission.SocietyTakeOutPound))
                    ) {
                        this.notifier.notify(source, "Vous n'avez pas l'autorisation de sortir ce véhicule.", 'error');

                        return;
                    }
                }

                // Simplify here, in the long term we should check if the vehicle is in the garage only (other state will be deleted)
                if (
                    playerVehicle.state !== PlayerVehicleState.InGarage &&
                    playerVehicle.state !== PlayerVehicleState.InJobGarage &&
                    playerVehicle.state !== PlayerVehicleState.InPound
                ) {
                    this.notifier.notify(source, 'Ce véhicule est déjà sorti.', 'error');

                    return;
                }

                const parkingPlaces = garage.parkingPlaces.filter(place => {
                    const placeCapacities = place.data?.capacity || [PlaceCapacity.Small, PlaceCapacity.Medium];

                    return placeCapacities.includes(capacity);
                });

                if (parkingPlaces.length === 0) {
                    this.notifier.notify(source, 'Aucune place de parking disponible.', 'error');

                    return;
                }

                const parkingPlace = getRandomItem(parkingPlaces);

                let price = 0;

                if (garage.type === GarageType.Depot) {
                    price = vehiclePrice * 0.15;
                }

                if (garage.type === GarageType.Private) {
                    const hours = Math.floor((Date.now() / 1000 - playerVehicle.parkingtime) / 3600);
                    price = Math.min(200, hours * 20);
                }

                if (price !== 0 && !this.playerMoneyService.remove(source, price)) {
                    this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');

                    return;
                }

                if (price !== 0) {
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

                if (price !== 0 && garage.type === GarageType.Depot) {
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

                if (
                    await this.vehicleSpawner.spawnPlayerVehicle(source, playerVehicle, [
                        ...parkingPlace.center,
                        parkingPlace.heading || 0,
                    ] as Vector4)
                ) {
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
                } else {
                    this.notifier.notify(
                        source,
                        'Une erreur est survenue lors du spawn du véhicule, veuillez ressayer.',
                        'error'
                    );
                }
            },
            1000
        );
    }

    private async getCitizenIdsForGarage(player: PlayerData, garage: Garage, propertyId: string): Promise<Set<string>> {
        const citizenIds = new Set<string>();

        if (garage.type === GarageType.House) {
            const property = await this.prismaService.housing_property.findUnique({
                where: {
                    identifier: propertyId,
                },
            });

            if (property) {
                const appartements = await this.prismaService.housing_apartment.findMany({
                    where: {
                        AND: [
                            { property_id: property.id },
                            { OR: [{ owner: player.citizenid }, { roommate: player.citizenid }] },
                        ],
                    },
                });

                if (appartements.length == 0) {
                    citizenIds.add(player.citizenid);
                    console.error('no appartements found for property', propertyId);
                }

                for (const appartement of appartements) {
                    citizenIds.add(appartement.owner);

                    if (appartement.roommate) {
                        citizenIds.add(appartement.roommate);
                    }
                }
            } else {
                console.error('property not found', propertyId);

                citizenIds.add(player.citizenid);
            }
        } else {
            citizenIds.add(player.citizenid);
        }

        return citizenIds;
    }
}

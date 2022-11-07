import { Prisma } from '@prisma/client';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { JobPermission, JobType } from '../../shared/job';
import { PlayerData } from '../../shared/player';
import { getRandomItem } from '../../shared/random';
import { RpcEvent } from '../../shared/rpc';
import { Garage, GarageType, GarageVehicle } from '../../shared/vehicle/garage';
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

    @Once(OnceStep.DatabaseConnected)
    public async init(): Promise<void> {
        await this.prismaService.$executeRawUnsafe(
            "UPDATE player_vehicles SET state = 1, garage = 'airportpublic' WHERE state = 0 AND job IS NULL AND category = 'car'"
        );
        await this.prismaService.$executeRawUnsafe(
            "UPDATE player_vehicles SET state = 3, garage = job WHERE state = 0 AND job IS NOT NULL AND category = 'car'"
        );

        await this.prismaService.$executeRawUnsafe(
            "UPDATE player_vehicles SET state = 1, garage = 'airport_air' WHERE state = 0 AND job IS NULL AND category = 'air'"
        );
        await this.prismaService.$executeRawUnsafe(
            "UPDATE player_vehicles SET state = 3, garage = concat(job,'_air') WHERE state = 0 AND job IS NOT NULL AND category = 'air'"
        );

        await this.prismaService.$executeRawUnsafe("UPDATE player_vehicles SET garage = 'mtp' WHERE garage = 'oil'");
        await this.prismaService.$executeRawUnsafe(
            "UPDATE player_vehicles SET garage = 'stonk' WHERE garage = 'cash-transfer'"
        );
        await this.prismaService.$executeRawUnsafe(
            "UPDATE player_vehicles SET garage = 'pound' WHERE state = 2 AND garage != 'pound'"
        );

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
            const days = Math.floor((Date.now() / 1000 - parkingTime.getTime()) / (24 * 60 * 60));
            const garage = vehicle.garage
                ? garages[vehicle.garage] || Object.values(garages).find(g => g.legacyId === vehicle.garage)
                : null;

            if ((!garage || vehicle.state === PlayerVehicleState.Missing) && vehicle.parkingtime > 2) {
                toVoid.push(vehicle.id);
            } else if (garage && garage.type === GarageType.Depot && days > 7) {
                toVoid.push(vehicle.id);
            } else if (garage && garage.type !== GarageType.Job && days > 21) {
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

    @Rpc(RpcEvent.VEHICLE_GARAGE_GET_FREE_PLACES)
    public async getFreePlaces(source: number, id: string, garage: Garage): Promise<number | null> {
        if (garage.type !== GarageType.Private) {
            return null;
        }

        const ids = [id];

        if (garage.legacyId) {
            ids.push(garage.legacyId);
        }

        const count = await this.prismaService.playerVehicle.count({
            where: {
                garage: { in: ids },
            },
        });

        return Math.max(0, 38 - count);
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
            const or = [{ citizenid: player.citizenid }] as Array<Prisma.PlayerVehicleWhereInput>;

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
        return playerVehicles.map(vehicle => {
            const playerVehicle = {
                id: vehicle.id,
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
                const vehiclePrice = this.vehicleRepository.findByModel(playerVehicle.modelName)?.price || 0;

                price = Math.round(vehiclePrice * 0.15);
            }

            if (garage.type === GarageType.Private) {
                const hours = Math.floor((timestamp - vehicle.parkingtime) / 3600);
                price = Math.min(200, hours * 20);
            }

            return {
                vehicle: playerVehicle,
                price,
                name: null,
            };
        });
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

        const vehicle = await this.prismaService.playerVehicle.findUnique({
            where: { id: vehicleState.id },
        });

        if (!vehicle) {
            this.notifier.notify(source, 'Ce véhicule ne figure pas dans les registres.', 'error');

            return;
        }

        const citizenIds = await this.getCitizenIdsForGarage(player, garage, id);

        if (
            (garage.type === GarageType.Private ||
                garage.type === GarageType.Public ||
                garage.type === GarageType.House) &&
            !citizenIds.has(vehicle.citizenid)
        ) {
            this.notifier.notify(
                source,
                "Vous ne pouvez pas ranger ce véhicule car vous n'etes pas la personne sur la carte grise.",
                'error'
            );

            return;
        } else if (garage.type === GarageType.Job && garage.job !== player.job.id) {
            this.notifier.notify(source, 'Vous ne pouvez pas ranger ce véhicule dans ce garage.', 'error');

            return;
        } else if (garage.type === GarageType.Depot && player.job.id !== JobType.Bennys) {
            this.notifier.notify(source, 'Vous ne pouvez pas ranger ce véhicule dans ce garage.', 'error');

            return;
        } else if (
            garage.type === GarageType.JobLuxury &&
            (garage.job !== player.job.id || (!vehicle.plate.startsWith('LUXE') && !vehicle.plate.startsWith('ESSAI')))
        ) {
            this.notifier.notify(source, 'Vous ne pouvez pas ranger ce véhicule dans ce garage.', 'error');

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
            // Only sync if vehicle was in correct state otherwise, do not update
            if (vehicle.state === PlayerVehicleState.Out) {
                await this.prismaService.playerVehicle.update({
                    where: { id: vehicle.id },
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
                const vehicle = await this.prismaService.playerVehicle.findUnique({
                    where: { id: vehicleId },
                });

                if (!vehicle) {
                    this.notifier.notify(source, "Ce véhicule n'existe pas", 'error');

                    return;
                }

                const citizenIds = await this.getCitizenIdsForGarage(player, garage, id);

                if (!citizenIds.has(vehicle.citizenid)) {
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
                        (vehicle.job !== player.job.id ||
                            !this.jobService.hasPermission(player, player.job.id, JobPermission.SocietyTakeOutPound))
                    ) {
                        this.notifier.notify(source, "Vous n'avez pas l'autorisation de sortir ce véhicule.", 'error');

                        return;
                    }
                }

                // Simplify here, in the long term we should check if the vehicle is in the garage only (other state will be deleted)
                if (
                    vehicle.state !== PlayerVehicleState.InGarage &&
                    vehicle.state !== PlayerVehicleState.InJobGarage &&
                    vehicle.state !== PlayerVehicleState.InPound
                ) {
                    this.notifier.notify(source, 'Ce véhicule est déjà sorti.', 'error');

                    return;
                }

                if (garage.parkingPlaces.length === 0) {
                    this.notifier.notify(source, 'Aucune place de parking disponible.', 'error');

                    return;
                }

                const parkingPlace = getRandomItem(garage.parkingPlaces);

                let price = 0;

                if (garage.type === GarageType.Depot) {
                    price = 10000;
                }

                if (garage.type === GarageType.Private) {
                    const hours = Math.floor((Date.now() / 1000 - vehicle.parkingtime) / 3600);
                    price = Math.min(200, hours * 20);
                }

                if (price !== 0 && !this.playerMoneyService.remove(source, price)) {
                    this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');

                    return;
                }

                if (
                    await this.vehicleSpawner.spawnPlayerVehicle(source, vehicle, [
                        ...parkingPlace.center,
                        parkingPlace.heading || 0,
                    ])
                ) {
                    await this.prismaService.playerVehicle.update({
                        where: { id: vehicle.id },
                        data: {
                            state: PlayerVehicleState.Out,
                        },
                    });

                    this.vehicleStateService.addVehicleKey(vehicle.plate, player.citizenid);

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
        citizenIds.add(player.citizenid);

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

                for (const appartement of appartements) {
                    citizenIds.add(appartement.owner);

                    if (appartement.roommate) {
                        citizenIds.add(appartement.roommate);
                    }
                }
            }
        }

        return citizenIds;
    }
}

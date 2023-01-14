import { add, differenceInDays } from 'date-fns';

import { AuctionZones, DealershipConfigItem, DealershipType } from '../../config/dealership';
import { GarageList } from '../../config/garage';
import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event';
import { JobType } from '../../shared/job';
import { Monitor } from '../../shared/monitor';
import { Zone } from '../../shared/polyzone/box.zone';
import { Vector4 } from '../../shared/polyzone/vector';
import { getRandomItems } from '../../shared/random';
import { RpcEvent } from '../../shared/rpc';
import { AuctionVehicle } from '../../shared/vehicle/auction';
import { getDefaultVehicleConfiguration, VehicleConfiguration } from '../../shared/vehicle/modification';
import { PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import { getDefaultVehicleCondition, Vehicle, VehicleMaxStock } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { LockService } from '../lock.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { VehicleService } from './vehicle.service';
import { VehicleSpawner } from './vehicle.spawner';

@Provider()
export class VehicleDealershipProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(LockService)
    private lockService: LockService;

    @Inject(Monitor)
    private monitor: Monitor;

    private auctions: Record<string, AuctionVehicle> = {};

    @Once(OnceStep.DatabaseConnected)
    public async initAuction() {
        const lastPurchases = await this.prismaService.player_purchases.groupBy({
            where: {
                shop_type: 'dealership',
                shop_id: DealershipType.Luxury,
            },
            by: ['item_id'],
            having: {
                item_id: {
                    _count: {
                        gte: 2,
                    },
                },
            },
        });

        const vehicles = await this.prismaService.vehicle.findMany({
            where: {
                model: {
                    notIn: lastPurchases.map(purchase => purchase.item_id),
                },
                category: {
                    in: ['Sports', 'Sportsclassic'],
                },
                price: {
                    gt: 0,
                },
                dealershipId: DealershipType.Luxury,
            },
        });

        const selectedVehicles = getRandomItems(vehicles, 2);

        for (const index in AuctionZones) {
            const auctionZone = AuctionZones[index];
            const selectedVehicle = selectedVehicles[index];

            if (!selectedVehicle) {
                continue;
            }

            const vehicle = {
                ...selectedVehicle,
                jobName: JSON.parse(selectedVehicle.jobName),
            };

            this.auctions[selectedVehicle.model] = {
                vehicle: {
                    ...vehicle,
                    maxStock: VehicleMaxStock[vehicle.category] || 0,
                },
                position: auctionZone.position as Vector4,
                windows: auctionZone.window,
                bestBid: null,
            };

            const configuration = getDefaultVehicleConfiguration();
            const plate = 'LUXE ' + (parseInt(index) + 1);

            configuration.modification = {
                ...configuration.modification,
                armor: 4,
                brakes: 2,
                engine: 3,
                transmission: 2,
                turbo: true,
            };

            await this.prismaService.playerVehicle.upsert({
                create: {
                    plate,
                    hash: vehicle.hash.toString(),
                    vehicle: vehicle.model,
                    garage: 'bennys_luxury',
                    job: 'bennys',
                    state: PlayerVehicleState.InGarage,
                    category: vehicle.requiredLicence,
                    fuel: 100,
                    engine: 1000,
                    body: 1000,
                    mods: JSON.stringify(configuration),
                    condition: JSON.stringify(getDefaultVehicleCondition()),
                    label: null,
                },
                update: {
                    vehicle: vehicle.model,
                    hash: vehicle.hash.toString(),
                    label: null,
                    garage: 'bennys_luxury',
                    state: PlayerVehicleState.InGarage,
                    mods: JSON.stringify(configuration),
                    condition: JSON.stringify(getDefaultVehicleCondition()),
                },
                where: {
                    plate,
                },
            });
        }

        TriggerClientEvent(ClientEvent.VEHICLE_DEALERSHIP_AUCTION_UPDATE, -1, this.auctions);
    }

    @Rpc(RpcEvent.VEHICLE_DEALERSHIP_GET_AUCTIONS)
    public getAuctions(): Record<string, AuctionVehicle> {
        return this.auctions;
    }

    @Rpc(RpcEvent.VEHICLE_DEALERSHIP_AUCTION_BID)
    public async auctionBid(source: number, name: string, price: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        const auction = this.auctions[name];

        if (!auction) {
            this.notifier.notify(source, "Ce véhicule n'est pas proposé à la mise aux enchères.", 'error');

            return;
        }

        return await this.lockService.lock(
            `auction_${name}`,
            async () => {
                if (auction.bestBid && auction.bestBid.price >= price) {
                    this.notifier.notify(source, 'Votre enchère est inférieure à la meilleure enchère.', 'error');

                    return false;
                }

                if (!auction.bestBid && auction.vehicle.price > price) {
                    this.notifier.notify(source, 'Votre enchère est inférieure au prix de départ.', 'error');

                    return false;
                }

                if (!(await this.playerMoneyService.transfer(player.charinfo.account, 'luxury_dealership', price))) {
                    this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');

                    return false;
                }

                if (
                    auction.bestBid &&
                    !(await this.playerMoneyService.transfer(
                        'luxury_dealership',
                        auction.bestBid.account,
                        auction.bestBid.price
                    ))
                ) {
                    this.notifier.notify(source, 'Erreur avec la banque. Merci de contacter un responsable.', 'error');

                    return false;
                }

                const previousCitizenId = auction.bestBid?.citizenId;

                this.auctions[name].bestBid = {
                    citizenId: player.citizenid,
                    account: player.charinfo.account,
                    price,
                    name: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                };

                this.notifier.notify(source, `Vous avez fait une enchère à hauteur de $${price}.`, 'error');

                if (previousCitizenId) {
                    const player = this.playerService.getPlayerByCitizenId(previousCitizenId);

                    if (player) {
                        this.notifier.notify(player.source, `Votre enchère a été dépassée.`, 'error');
                    }
                }
                TriggerClientEvent(ClientEvent.VEHICLE_DEALERSHIP_AUCTION_UPDATE, -1, this.auctions);

                return true;
            },
            1000
        );
    }

    public async finishAuctions() {
        for (const auction of Object.values(this.auctions)) {
            if (!auction.bestBid) {
                continue;
            }

            const player = await this.prismaService.player.findUnique({
                where: {
                    citizenid: auction.bestBid.citizenId,
                },
            });

            if (!player) {
                continue;
            }

            const plate = await this.vehicleService.generatePlate();
            const nowInSeconds = Math.round(Date.now() / 1000);

            await this.prismaService.playerVehicle.create({
                data: {
                    license: player.license,
                    citizenid: player.citizenid,
                    vehicle: auction.vehicle.model,
                    hash: auction.vehicle.hash.toString(),
                    mods: JSON.stringify(getDefaultVehicleConfiguration()),
                    condition: JSON.stringify(getDefaultVehicleCondition()),
                    garage: 'airportpublic',
                    plate,
                    category: auction.vehicle.category,
                    state: PlayerVehicleState.InGarage,
                    life_counter: 3,
                    boughttime: nowInSeconds,
                    parkingtime: nowInSeconds,
                },
            });

            await this.prismaService.player_purchases.create({
                data: {
                    shop_type: 'dealership',
                    shop_id: DealershipType.Luxury,
                    item_id: auction.vehicle.model,
                    amount: auction.bestBid.price,
                    citizenid: auction.bestBid.citizenId,
                    date: nowInSeconds,
                },
            });
        }
    }

    @Rpc(RpcEvent.VEHICLE_DEALERSHIP_GET_LIST)
    public async getDealershipList(source: number, id: string): Promise<Vehicle[]> {
        const vehicles = await this.prismaService.vehicle.findMany({
            where: {
                dealershipId: id,
            },
        });

        return vehicles.map(vehicle => {
            return {
                ...vehicle,
                jobName: JSON.parse(vehicle.jobName),
                maxStock: VehicleMaxStock[vehicle.category] || 0,
            };
        });
    }

    @Rpc(RpcEvent.VEHICLE_DEALERSHIP_GET_LIST_JOB)
    public async getDealershipListJob(source: number, job: JobType): Promise<Vehicle[]> {
        const jobVehicles = await this.prismaService.concess_entreprise.findMany({
            where: {
                job: job,
            },
        });

        const vehicles = await this.prismaService.vehicle.findMany({
            where: {
                model: {
                    in: jobVehicles.map(jobVehicle => jobVehicle.vehicle),
                },
            },
        });

        return jobVehicles.map(jobVehicle => {
            const vehicle = vehicles.find(vehicle => vehicle.model === jobVehicle.vehicle);
            const jobName = JSON.parse(vehicle.jobName);

            return {
                ...vehicle,
                jobName: JSON.parse(vehicle.jobName),
                // Vehicle job are always available
                stock: 100,
                // Use price for job
                price: jobVehicle.price,
                maxStock: VehicleMaxStock[vehicle.category] || 0,
                name: jobName && jobName[job] ? jobName[job] : vehicle.name,
            };
        });
    }

    @Rpc(RpcEvent.VEHICLE_DEALERSHIP_BUY)
    public async buyVehicle(
        source: number,
        vehicle: Vehicle,
        dealershipId: DealershipType,
        dealership?: DealershipConfigItem,
        parkingPlace?: Zone
    ): Promise<boolean> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }
        

        const playerVehicleCount = await this.prismaService.playerVehicle.count({
            where: {
                citizenid: player.citizenid,
            },
        });

        if (playerVehicleCount >= player.metadata.vehicleLimit) {
            this.notifier.notify(source, "Vous avez atteint la limite de véhicule sur votre carte grise !", 'error');

            return false;
        }

        if (
            vehicle.requiredLicence &&
            (!player.metadata.licences[vehicle.requiredLicence] ||
                player.metadata.licences[vehicle.requiredLicence] <= 0)
        ) {
            this.notifier.notify(source, "Vous n'avez pas le permis nécessaire !", 'error');

            return false;
        }

        if (dealership?.daysBeforeNextPurchase && dealership?.daysBeforeNextPurchase > 0) {
            const lastPurchase = await this.prismaService.player_purchases.findFirst({
                where: {
                    citizenid: player.citizenid,
                    shop_id: dealershipId,
                },
                orderBy: {
                    date: 'desc',
                },
            });

            if (lastPurchase) {
                const lastPurchaseDate = new Date(lastPurchase.date * 1000);
                const nextPurchaseDate = add(lastPurchaseDate, {
                    days: dealership.daysBeforeNextPurchase,
                });

                if (nextPurchaseDate.getTime() > Date.now()) {
                    const days = differenceInDays(nextPurchaseDate, new Date());
                    this.notifier.notify(source, `Tu dois attendre ${days} jour(s) avant ton prochain achat.`, 'error');

                    return false;
                }
            }
        }

        return await this.lockService.lock(
            `vehicle_buy_${vehicle.model}`,
            async () => {
                if (dealershipId !== DealershipType.Job) {
                    const refreshedVehicle = await this.prismaService.vehicle.findFirst({
                        where: {
                            model: vehicle.model,
                        },
                        select: {
                            stock: true,
                        },
                    });

                    if (refreshedVehicle.stock <= 0) {
                        this.notifier.notify(source, "Ce véhicule n'est plus disponible.", 'error');

                        return false;
                    }
                }

                if (!this.playerMoneyService.remove(source, vehicle.price)) {
                    this.notifier.notify(source, `Tu n'as pas assez d'argent.`, 'error');

                    return false;
                }

                let livery = 0;

                if (dealershipId === DealershipType.Job) {
                    const vehicleJob = await this.prismaService.concess_entreprise.findFirst({
                        select: {
                            liverytype: true,
                        },
                        where: {
                            vehicle: vehicle.model,
                            job: player.job.id,
                        },
                    });

                    livery = vehicleJob?.liverytype || null;
                }

                const plate =
                    dealershipId === DealershipType.Job
                        ? await this.vehicleService.generateJobPlate(player.job.id)
                        : await this.vehicleService.generatePlate();
                const nowInSeconds = Math.round(Date.now() / 1000);

                const configuration: VehicleConfiguration = {
                    ...getDefaultVehicleConfiguration(),
                    livery,
                };

                const playerVehicle = await this.prismaService.playerVehicle.create({
                    data: {
                        license: player.license,
                        citizenid: player.citizenid,
                        vehicle: vehicle.model,
                        hash: vehicle.hash.toString(),
                        mods: JSON.stringify(configuration),
                        condition: JSON.stringify(getDefaultVehicleCondition()),
                        garage: dealershipId !== DealershipType.Job && dealership ? dealership.garageName : null,
                        plate,
                        category: vehicle.category,
                        state:
                            dealershipId !== DealershipType.Job ? PlayerVehicleState.InGarage : PlayerVehicleState.Out,
                        job: dealershipId === DealershipType.Job ? player.job.id : null,
                        life_counter: 3,
                        boughttime: nowInSeconds,
                        parkingtime: nowInSeconds,
                    },
                });

                this.monitor.publish(
                    'vehicle_buy',
                    {
                        player_source: source,
                        buy_type: dealershipId === DealershipType.Job ? 'job' : 'citizen',
                    },
                    {
                        price: vehicle.price,
                        vehicle_model: vehicle.model,
                        vehicle_plate: playerVehicle.plate,
                    }
                );

                await this.prismaService.player_purchases.create({
                    data: {
                        citizenid: player.citizenid,
                        shop_type: 'dealership',
                        shop_id: dealershipId,
                        item_id: vehicle.model,
                        amount: vehicle.price,
                        date: nowInSeconds,
                    },
                });

                if (dealershipId !== DealershipType.Job) {
                    await this.prismaService.vehicle.update({
                        where: {
                            model: vehicle.model,
                        },
                        data: {
                            stock: {
                                decrement: 1,
                            },
                        },
                    });
                }

                if (dealershipId === DealershipType.Job) {
                    await this.vehicleSpawner.spawnPlayerVehicle(source, playerVehicle, [
                        ...parkingPlace.center,
                        parkingPlace.heading || 0,
                    ] as Vector4);

                    this.notifier.notify(source, `Merci pour votre achat !'`, 'success');
                } else {
                    const garageConfig = GarageList[dealership.garageName];

                    this.notifier.notify(
                        source,
                        `Merci pour votre achat ! Le véhicule a été envoyé au garage '${garageConfig.name}'`,
                        'success'
                    );
                }

                return true;
            },
            5000
        );
    }
}

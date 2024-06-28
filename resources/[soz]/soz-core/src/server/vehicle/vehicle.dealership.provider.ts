import { On, Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Logger } from '@public/core/logger';
import { ServerEvent } from '@public/shared/event';
import { PlayerData } from '@public/shared/player';
import { formatDuration } from '@public/shared/utils/timeformat';
import { add, addSeconds } from 'date-fns';

import { AuctionZones, DealershipConfig, DealershipType } from '../../config/dealership';
import { GarageList } from '../../config/garage';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { TaxType } from '../../shared/bank';
import { JobType } from '../../shared/job';
import { Zone } from '../../shared/polyzone/box.zone';
import { Vector4 } from '../../shared/polyzone/vector';
import { getRandomItems } from '../../shared/random';
import { RpcServerEvent } from '../../shared/rpc';
import { AuctionVehicle } from '../../shared/vehicle/auction';
import { getDefaultVehicleConfiguration, VehicleConfiguration } from '../../shared/vehicle/modification';
import { PlayerVehicleState } from '../../shared/vehicle/player.vehicle';
import {
    getDefaultVehicleCondition,
    isVehicleModelElectric,
    Vehicle,
    VehicleClassFuelStorageMultiplier,
} from '../../shared/vehicle/vehicle';
import { BankService } from '../bank/bank.service';
import { PrismaService } from '../database/prisma.service';
import { LockService } from '../lock.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { VehicleRepository } from '../repository/vehicle.repository';
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

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(LockService)
    private lockService: LockService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(Logger)
    private logger: Logger;

    @Inject(BankService)
    private bankService: BankService;

    private auctions: Record<string, AuctionVehicle> = {};

    private auctionTimeStart: Date;
    private auctionTimeStop: Date;

    private activeGuard: Record<number, number> = {};

    @Once(OnceStep.DatabaseConnected)
    public async initAuction() {
        const vehicles = await this.prismaService.vehicle.findMany({
            where: {
                price: {
                    gt: 0,
                },
                stock: {
                    gt: 0,
                },
                dealershipId: DealershipType.Luxury,
            },
        });

        this.logger.info(vehicles.map(veh => veh?.model).join(','));

        const selectedVehicles = getRandomItems(vehicles, 2);

        this.monitor.traceEvent('vehicle_luxury_selected', {
            vehicle_name: selectedVehicles[0].name + ', ' + selectedVehicles[1].name,
        });

        for (const index in AuctionZones) {
            const auctionZone = AuctionZones[index];
            const selectedVehicle = selectedVehicles[index];

            if (!selectedVehicle) {
                continue;
            }

            const vehicle = {
                ...selectedVehicle,
                jobName: JSON.parse(selectedVehicle.jobName),
                handling: selectedVehicle.handling ? JSON.parse(selectedVehicle.handling) : null,
            };

            this.auctions[selectedVehicle.model] = {
                vehicle: { ...vehicle },
                position: auctionZone.position as Vector4,
                windows: auctionZone.window,
                bestBid: null,
                nextMinBid: this.nextMinBid(vehicle.price, null),
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

            const condition = getDefaultVehicleCondition();
            condition.fuelLevel =
                condition.fuelLevel * (VehicleClassFuelStorageMultiplier[vehicle?.requiredLicence] || 1.0);

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
                    condition: JSON.stringify(condition),
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

        const auctionTimeStop = new Date();
        auctionTimeStop.setHours(22, 0, 0, 0);
        this.auctionTimeStop = addSeconds(auctionTimeStop, Math.round(Math.random() * 7200));

        const auctionTimeStart = new Date();
        auctionTimeStart.setHours(12, 0, 0, 0);
        this.auctionTimeStart = auctionTimeStart;
    }

    @OnEvent(ServerEvent.LUXURY_DELETE_GUARD)
    public async onLuxuryDeleteGuard(source: number, guardNetId: number) {
        const ped = NetworkGetEntityFromNetworkId(guardNetId);
        DeleteEntity(ped);
        delete this.activeGuard[source];
    }

    @OnEvent(ServerEvent.LUXURY_CREATED_GUARD)
    public async onLuxuryCreatedGuard(source: number, guardNetId: number) {
        this.activeGuard[source] = guardNetId;
    }

    @On('playerDropped')
    public onDropped(source: number) {
        if (this.activeGuard[source]) {
            this.onLuxuryDeleteGuard(source, this.activeGuard[source]);
        }
    }

    @Rpc(RpcServerEvent.VEHICLE_DEALERSHIP_GET_AUCTIONS)
    public getAuctions(): [Record<string, AuctionVehicle>, boolean] {
        return [this.auctions, this.IsAuctionDisable()];
    }

    @Rpc(RpcServerEvent.VEHICLE_DEALERSHIP_AUCTION_BID)
    public async auctionBid(source: number, name: string, price: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return false;
        }

        if (this.IsAuctionDisable()) {
            this.notifier.notify(source, 'Les enchères sont déjà terminées.', 'error');

            return;
        }

        const auction = this.auctions[name];

        if (!auction) {
            this.notifier.notify(source, "Ce véhicule n'est pas proposé à la mise aux enchères.", 'error');

            return;
        }

        if (!(await this.vehicleCountCheck(player))) {
            return false;
        }

        if (
            auction.vehicle.requiredLicence &&
            (!player.metadata.licences[auction.vehicle.requiredLicence] ||
                player.metadata.licences[auction.vehicle.requiredLicence] <= 0)
        ) {
            this.notifier.notify(source, "Vous n'avez pas le permis nécessaire !", 'error');

            return false;
        }

        return await this.lockService.lock(
            `auction_${name}`,
            async () => {
                if (auction.nextMinBid > price) {
                    this.notifier.notify(source, "Votre enchère est inférieure à l'enchère minimum.", 'error');

                    return false;
                }

                if (
                    !(await this.bankService.transferFarmMoney(
                        source,
                        'luxury_dealership',
                        player.charinfo.account,
                        price,
                        'money',
                        true
                    ))
                ) {
                    this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');

                    return false;
                }

                if (
                    auction.bestBid &&
                    !(await this.bankService.transferFarmMoney(
                        source,
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
                this.auctions[name].nextMinBid = this.nextMinBid(this.auctions[name].vehicle.price, price);

                this.notifier.notify(source, `Vous avez émis une enchère d'une valeur de $${price}.`, 'success');

                if (previousCitizenId) {
                    const player = this.playerService.getPlayerByCitizenId(previousCitizenId);

                    if (player) {
                        this.notifier.notify(player.source, `Votre enchère a été dépassée.`, 'error');
                    }
                }

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

            const condition = getDefaultVehicleCondition();
            const vehicle = await this.vehicleRepository.findByModel(auction.vehicle.model);
            condition.fuelLevel =
                condition.fuelLevel * (VehicleClassFuelStorageMultiplier[vehicle?.requiredLicence] || 1.0);

            await this.prismaService.playerVehicle.create({
                data: {
                    license: player.license,
                    citizenid: player.citizenid,
                    vehicle: auction.vehicle.model,
                    hash: auction.vehicle.hash.toString(),
                    mods: JSON.stringify(getDefaultVehicleConfiguration()),
                    condition: JSON.stringify(condition),
                    garage: 'airport_public',
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

    @Rpc(RpcServerEvent.VEHICLE_DEALERSHIP_GET_LIST)
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
                handling: vehicle.handling ? JSON.parse(vehicle.handling) : null,
            };
        });
    }

    @Rpc(RpcServerEvent.VEHICLE_DEALERSHIP_GET_LIST_JOB)
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
                name: jobName && jobName[job] ? jobName[job] : vehicle.name,
                handling: vehicle.handling ? JSON.parse(vehicle.handling) : null,
            };
        });
    }

    private async vehicleCountCheck(player: PlayerData) {
        const playerVehicles = await this.prismaService.playerVehicle.findMany({
            where: {
                citizenid: player.citizenid,
                job: null,
                state: {
                    not: PlayerVehicleState.Destroyed,
                },
                crimiImport: false,
            },
        });

        let playerVehicleCount = 0;
        for (const veh of playerVehicles) {
            const vehDef = await this.vehicleRepository.findByModel(veh.vehicle);

            if (vehDef && vehDef.dealershipId && vehDef.dealershipId !== DealershipType.Cycle) {
                playerVehicleCount++;
            }
        }

        if (playerVehicleCount >= player.metadata.vehiclelimit) {
            let errorMsg = `Limite de véhicule atteinte (${playerVehicleCount}/${player.metadata.vehiclelimit})`;
            if (player.metadata.vehiclelimit < 10) errorMsg += ". Améliorez votre carte grise à l'auto-école.";

            this.notifier.notify(player.source, errorMsg, 'error');

            return false;
        }

        return true;
    }

    @Rpc(RpcServerEvent.VEHICLE_DEALERSHIP_BUY)
    public async buyVehicle(
        source: number,
        vehicle: Vehicle,
        dealershipId: DealershipType,
        parkingPlace?: Zone
    ): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        const dealership = DealershipConfig[dealershipId];

        if (!player) {
            return false;
        }

        if (dealershipId !== DealershipType.Job && dealershipId !== DealershipType.Cycle) {
            if (!(await this.vehicleCountCheck(player))) {
                return;
            }
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

                const delta = nextPurchaseDate.getTime() - Date.now();
                if (delta > 0) {
                    const delay = formatDuration(delta);
                    this.notifier.notify(source, `Tu dois attendre ${delay} avant ton prochain achat.`, 'error');

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

                const taxType = isVehicleModelElectric(vehicle.hash) ? TaxType.GREEN : TaxType.VEHICLE;

                if (!(await this.playerMoneyService.buy(source, vehicle.price, taxType))) {
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

                    livery = vehicleJob?.liverytype;
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

                let garage = dealershipId !== DealershipType.Job ? dealership?.garageName : null;
                let state = dealershipId !== DealershipType.Job ? PlayerVehicleState.InGarage : PlayerVehicleState.Out;

                if (dealershipId == DealershipType.Job && vehicle.category == 'Boats') {
                    garage = 'docks_boat';
                    state = PlayerVehicleState.InGarage;
                    configuration.color = null;
                }

                const condition = getDefaultVehicleCondition();
                condition.fuelLevel =
                    condition.fuelLevel * (VehicleClassFuelStorageMultiplier[vehicle?.requiredLicence] || 1.0);

                const playerVehicle = await this.prismaService.playerVehicle.create({
                    data: {
                        license: player.license,
                        citizenid: player.citizenid,
                        vehicle: vehicle.model,
                        hash: vehicle.hash.toString(),
                        mods: JSON.stringify(configuration),
                        condition: JSON.stringify(condition),
                        garage: garage,
                        plate,
                        category: vehicle.category,
                        state: state,
                        job: dealershipId === DealershipType.Job ? player.job.id : null,
                        life_counter: 3,
                        boughttime: nowInSeconds,
                        parkingtime: nowInSeconds,
                    },
                });

                this.monitor.traceEvent('vehicle_buy', {
                    player_source: source,
                    buy_type: dealershipId === DealershipType.Job ? 'job' : 'citizen',
                    money: vehicle.price,
                    vehicle_model: vehicle.model,
                    vehicle_plate: playerVehicle.plate,
                });

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

                if (dealershipId === DealershipType.Job && vehicle.category != 'Boats') {
                    await this.vehicleSpawner.spawnPlayerVehicle(source, playerVehicle, [
                        ...parkingPlace.center,
                        parkingPlace.heading || 0,
                    ] as Vector4);

                    this.notifier.notify(source, `Merci pour votre achat !`, 'success');
                } else {
                    const garageConfig = GarageList[garage];

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

    public IsAuctionDisable(): boolean {
        const now = new Date();
        return (
            !this.auctionTimeStop ||
            !this.auctionTimeStart ||
            now >= this.auctionTimeStop ||
            now <= this.auctionTimeStart
        );
    }

    nextMinBid(vehiclePrice: number, bestBid?: number) {
        return bestBid ? Math.round(bestBid + Math.max(10_000, Math.min(50_000, bestBid * 0.05))) : vehiclePrice;
    }
}

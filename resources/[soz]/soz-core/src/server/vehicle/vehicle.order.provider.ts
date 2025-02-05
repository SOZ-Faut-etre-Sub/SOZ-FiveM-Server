import { VehicleBusinessImportConf } from '@private/shared/business.vehicle';
import { Once, OnceStep } from '@public/core/decorators/event';
import { JobType } from '@public/shared/job';
import { UpwConfig } from '@public/shared/job/upw';
import { PlayerData } from '@public/shared/player';
import { formatDuration } from '@public/shared/utils/timeformat';
import { getDefaultVehicleConfiguration, VehicleConfiguration } from '@public/shared/vehicle/modification';
import { PlayerVehicleState } from '@public/shared/vehicle/player.vehicle';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick } from '../../core/decorators/tick';
import { uuidv4 } from '../../core/utils';
import { BennysConfig } from '../../shared/job/bennys';
import { RpcServerEvent } from '../../shared/rpc';
import {
    getDefaultVehicleCondition,
    VehicleClassFuelStorageMultiplier,
    VehicleCondition,
    VehicleOrder,
    VehicleOrderConfig,
    VehicleOrderCostMuliplier,
    VehicleOrderMode,
} from '../../shared/vehicle/vehicle';
import { BankService } from '../bank/bank.service';
import { PrismaService } from '../database/prisma.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleService } from './vehicle.service';

const Configs: Partial<Record<JobType, VehicleOrderConfig>> = {
    [JobType.Upw]: UpwConfig.Order,
    [JobType.Bennys]: BennysConfig.Order,
};

@Provider()
export class VehicleOrderProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(Monitor)
    private monitor: Monitor;

    private ordersInProgress: Map<string, VehicleOrder> = new Map();

    private orderedVehicle = 0;

    @Once(OnceStep.DatabaseConnected)
    public async init() {
        const orders = await this.prismaService.vehicle_order.findMany();
        for (const order of orders) {
            const data = JSON.parse(order.data);
            this.ordersInProgress.set(order.id, {
                uuid: order.id,
                deliverDate: order.deliverDate.getTime(),
                model: order.model,
                gang: data.gang,
                job: data.job,
                citizenId: data.citizenId,
                license: data.license,
                garage: data.garage,
            });
        }
    }

    @Tick(10_000)
    public async onTick() {
        for (const [uuid, vehicleOrder] of this.ordersInProgress.entries()) {
            if (vehicleOrder.deliverDate < Date.now()) {
                await this.addVehicle(vehicleOrder);
                this.ordersInProgress.delete(uuid);
                await this.prismaService.vehicle_order.delete({
                    where: {
                        id: uuid,
                    },
                });
            }
        }
    }

    @Rpc(RpcServerEvent.VEHICLE_ORDER_GET)
    public getOrders(source: number, mode: VehicleOrderMode): VehicleOrder[] {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return [];
        }

        if (mode == VehicleOrderMode.Job) {
            return Array.from(this.ordersInProgress.values()).filter(order => order.job == player.job.id);
        } else {
            return Array.from(this.ordersInProgress.values()).filter(order => order.gang == player.gang.id);
        }
    }

    @Rpc(RpcServerEvent.VEHICLE_ORDER_CANCEL)
    public async onCancelOrder(source: number, uuid: string, mode: VehicleOrderMode) {
        const order = this.ordersInProgress.get(uuid);
        if (!order) {
            this.notifier.notify(source, `Cette commande n'existe pas.`);
            return this.getOrders(source, mode);
        }

        this.ordersInProgress.delete(uuid);
        await this.prismaService.vehicle_order.delete({
            where: {
                id: uuid,
            },
        });

        const vehDef = await this.vehicleRepository.findByModel(order.model);
        this.notifier.notify(
            source,
            `${order.gang ? "L'importation" : 'La commande'} du véhicule ~b~${vehDef.name}~s~ a bien été ~r~annulé~s~.`
        );

        return this.getOrders(source, mode);
    }

    @Rpc(RpcServerEvent.VEHICLE_ORDER_DO)
    public async onOrderVehicle(source: number, model: string, mode: VehicleOrderMode, phone: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const vehicle = await this.vehicleRepository.findByModel(model);
        if (!vehicle || vehicle.price === 0) {
            this.notifier.notify(source, `Ce modèle de véhicule n'est pas disponible.`);
            return this.getOrders(source, mode);
        }

        let playerDst: PlayerData = null;
        let waitTime = 0;
        const vehiclePrice = Math.ceil(vehicle.price * VehicleOrderCostMuliplier[mode]);
        let garage = null;
        if (mode == VehicleOrderMode.Job) {
            const config = Configs[player.job.id];
            const transferred = await this.bankService.transferFarmMoney(
                source,
                config.farm,
                config.account,
                vehiclePrice,
                'money',
                true
            );

            if (!transferred) {
                this.notifier.notify(
                    source,
                    `Il faut ~r~${vehiclePrice.toLocaleString()}$~s~ sur le compte de l'entreprise.`
                );
                return this.getOrders(source, mode);
            } else {
                this.notifier.notify(source, `Virement de ~g~${vehiclePrice.toLocaleString()}$~s~ effectué.`);
            }
            waitTime = config.waitingTime;
            garage = Configs[player.job.id].garage;
        } else if ([VehicleOrderMode.Crimi, VehicleOrderMode.Cartel].includes(mode)) {
            playerDst = this.playerService.getPlayerByPhone(phone);
            if (!playerDst) {
                this.notifier.notify(source, `Le numéro n'est pas actif.`, 'error');
                return this.getOrders(source, mode);
            }

            if (!this.playerMoneyService.remove(source, vehiclePrice, 'marked_money')) {
                this.notifier.notify(
                    source,
                    `Vous n'avez ~r~pas assez d'argent sale~s~ sur vous pour importer ce véhicule. Reviens lorsque tu auras la somme requise !`,
                    'error'
                );
                return this.getOrders(source, mode);
            }

            waitTime = VehicleBusinessImportConf.VehicleBusinessImportDuration;

            if (VehicleOrderMode.Crimi == mode) {
                garage = 'garage_gang_' + player.gang.id;
            } else if (VehicleOrderMode.Cartel == mode) {
                garage = 'sandy_shores_air';
            }
        }

        const uuid = uuidv4();
        const order: VehicleOrder = {
            uuid,
            model,
            deliverDate: Date.now() + waitTime * 60_000,
            job: mode == VehicleOrderMode.Job ? player.job.id : null,
            gang: [VehicleOrderMode.Crimi, VehicleOrderMode.Cartel].includes(mode) ? player.gang.id : null,
            citizenId: playerDst ? playerDst.citizenid : null,
            license: playerDst ? playerDst.license : null,
            garage,
        };
        this.ordersInProgress.set(uuid, order);

        const duration = formatDuration(Date.now() - order.deliverDate);
        this.notifier.notify(
            source,
            `${order.gang ? "L'importation" : 'La commande'} du véhicule ~b~${vehicle.name}~s~ a bien été ~g~réalisé~s~. Elle sera livrée dans ~b~${duration}~s~.`
        );

        await this.prismaService.vehicle_order.create({
            data: {
                id: order.uuid,
                model: order.model,
                deliverDate: new Date(order.deliverDate),
                data: JSON.stringify({
                    gang: order.gang,
                    job: order.job,
                    citizenId: order.citizenId,
                    license: order.license,
                    garage,
                }),
            },
        });

        this.monitor.traceEvent('vehicle_order_add', {
            player_source: source,
            target_job: order.job,
            vehicle_model: order.model,
            id: order.uuid,
            citizen_ids: [order.citizenId],
        });

        return this.getOrders(source, mode);
    }

    private async addVehicle(order: VehicleOrder) {
        const vehicle = await this.prismaService.vehicle.findFirst({
            where: {
                model: order.model,
            },
        });
        let category = 'car';
        if (vehicle.requiredLicence === 'heli') {
            category = 'air';
        } else if (vehicle.requiredLicence === 'boat') {
            category = 'boat';
        }

        const fuel =
            getDefaultVehicleCondition().fuelLevel *
            (VehicleClassFuelStorageMultiplier[vehicle?.requiredLicence] || 1.0);
        const condition: VehicleCondition = {
            ...getDefaultVehicleCondition(),
            fuelLevel: fuel,
        };

        const plate = order.job != null ? 'ESSAI N' + this.orderedVehicle++ : await this.vehicleService.generatePlate();
        const mods: VehicleConfiguration =
            order.job != null ? BennysConfig.UpgradeConfiguration : getDefaultVehicleConfiguration();
        const state = order.job != null ? PlayerVehicleState.InJobGarage : PlayerVehicleState.InGarage;

        const nowInSeconds = Math.round(Date.now() / 1000);
        const crimiImport = order.gang != null;

        await this.prismaService.playerVehicle.create({
            data: {
                citizenid: order.citizenId,
                license: order.license,
                vehicle: order.model,
                hash: GetHashKey(order.model).toString(),
                mods: JSON.stringify(mods),
                condition: JSON.stringify(condition),
                plate: plate,
                garage: order.garage,
                job: order.job,
                category: category,
                fuel: 100,
                engine: 1000,
                body: 1000,
                state: state,
                life_counter: 3,
                boughttime: nowInSeconds,
                parkingtime: nowInSeconds,
                crimiImport: crimiImport,
            },
        });

        this.monitor.traceEvent('vehicle_order_deliver', {
            garage_id: order.garage,
            target_job: order.job,
            vehicle_model: order.model,
            id: order.uuid,
            citizen_ids: [order.citizenId],
            vehicle_plate: plate,
        });
    }
}

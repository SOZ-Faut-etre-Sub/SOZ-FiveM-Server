import { JobType } from '@public/shared/job';
import { UpwConfig } from '@public/shared/job/upw';

import { BankService } from '../../client/bank/bank.service';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { uuidv4 } from '../../core/utils';
import { BennysConfig } from '../../shared/job/bennys';
import { RpcServerEvent } from '../../shared/rpc';
import {
    getDefaultVehicleCondition,
    VehicleClassFuelStorageMultiplier,
    VehicleCondition,
    VehicleOrder,
    VehicleOrderConfig,
} from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';

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

    private ordersInProgress: Map<string, VehicleOrder> = new Map();

    private orderedVehicle = 0;

    // Tick every minute to check the orders to complete.
    @Tick(TickInterval.EVERY_MINUTE)
    public async onTick() {
        for (const [uuid, vehicleOrder] of this.ordersInProgress.entries()) {
            if (vehicleOrder.deliverDate < Date.now()) {
                await this.addVehicle(vehicleOrder);
                this.ordersInProgress.delete(uuid);
            }
        }
    }

    @Rpc(RpcServerEvent.VEHICLE_ORDER_GET)
    public getOrders(source: number): VehicleOrder[] {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return [];
        }

        return Array.from(this.ordersInProgress.values()).filter(order => (order.job = player.job.id));
    }

    @Rpc(RpcServerEvent.VEHICLE_ORDER_CANCEL)
    public async onCancelOrder(source: number, uuid: string) {
        const order = this.ordersInProgress.get(uuid);
        if (!order) {
            this.notifier.notify(source, `Cette commande n'existe pas.`);
            return;
        }
        this.ordersInProgress.delete(uuid);
        this.notifier.notify(source, `Commande annulée.`);

        return this.getOrders(source);
    }

    @Rpc(RpcServerEvent.VEHICLE_ORDER_DO)
    public async onOrderVehicle(source: number, model: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const config = Configs[player.job.id];
        const vehicle = await this.prismaService.vehicle.findFirst({
            where: {
                model,
                NOT: {
                    dealershipId: null,
                    price: 0,
                },
            },
        });
        if (!vehicle || vehicle.price === 0) {
            this.notifier.notify(source, `Ce modèle de véhicule n'est pas disponible.`);
            return this.getOrders(source);
        }
        const vehiclePrice = Math.ceil(vehicle.price * 0.01);
        
        const transferred = await this.bankService.transferFarmMoney(source, 'farm_bennys', 'bennys', vehiclePrice, 'money', true);

        if (!transferred) {
            this.notifier.notify(
                source,
                `Il faut ~r~${vehiclePrice.toLocaleString()}$~s~ sur le compte de l'entreprise.`
            );
            return this.getOrders(source);
        } else {
            this.notifier.notify(source, `Virement de ~g~${vehiclePrice.toLocaleString()}$~s~ effectué.`);
        }

        const uuid = uuidv4();
        const coef = GetConvar('soz_core_environment', 'development') ? 30 : 1;
        this.ordersInProgress.set(uuid, {
            uuid,
            model,
            deliverDate: Date.now() + (config.waitingTime * 60_000) / coef,
            job: player.job.id,
        });

        this.notifier.notify(source, `Votre ${vehicle.model} arrive dans une heure.`);

        return this.getOrders(source);
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

        await this.prismaService.playerVehicle.create({
            data: {
                vehicle: order.model,
                hash: GetHashKey(order.model).toString(),
                mods: JSON.stringify(BennysConfig.UpgradeConfiguration),
                condition: JSON.stringify(condition),
                plate: 'ESSAI N' + (this.orderedVehicle + 1),
                garage: Configs[order.job].garage,
                job: order.job,
                category: category,
                fuel: 100,
                engine: 1000,
                body: 1000,
                state: 3,
                life_counter: 3,
            },
        });
        this.orderedVehicle++;
    }
}

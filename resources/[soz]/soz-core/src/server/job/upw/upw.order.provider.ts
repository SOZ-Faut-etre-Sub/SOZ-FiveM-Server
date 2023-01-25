import { Vehicle } from '@prisma/client';
import { UpwConfig, UpwOrder } from '@public/shared/job/upw';

import { BankService } from '../../../client/bank/bank.service';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Rpc } from '../../../core/decorators/rpc';
import { Tick, TickInterval } from '../../../core/decorators/tick';
import { uuidv4 } from '../../../core/utils';
import { BennysConfig } from '../../../shared/job/bennys';
import { RpcEvent } from '../../../shared/rpc';
import { getDefaultVehicleCondition } from '../../../shared/vehicle/vehicle';
import { PrismaService } from '../../database/prisma.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

@Provider()
export class UpwOrderProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankService)
    private bankService: BankService;

    private ordersInProgress: Map<string, UpwOrder> = new Map();

    private orderedVehicle = 0;

    // Tick every minute to check the orders to complete.
    @Tick(TickInterval.EVERY_MINUTE)
    public async onTick() {
        for (const [uuid, upwOrder] of this.ordersInProgress.entries()) {
            if (new Date(upwOrder.orderDate).getTime() + 1000 * 60 * UpwConfig.Order.waitingTime < Date.now()) {
                await this.addVehicle(upwOrder.model);
                this.ordersInProgress.delete(uuid);
            }
        }
    }

    @Rpc(RpcEvent.UPW_GET_ORDERS)
    public getOrders(): UpwOrder[] {
        return Array.from(this.ordersInProgress.values());
    }

    @Rpc(RpcEvent.UPW_GET_CATALOG)
    public async getCatalog(): Promise<Vehicle[]> {
        const catalog = await this.prismaService.vehicle.findMany({
            where: {
                category: 'Electric',
            },
        });
        return catalog;
    }

    @Rpc(RpcEvent.UPW_CANCEL_ORDER)
    public async onCancelOrder(source: number, uuid: string) {
        const order = this.ordersInProgress.get(uuid);
        if (!order) {
            this.notifier.notify(source, `Cette commande n'existe pas.`);
            return;
        }
        this.ordersInProgress.delete(uuid);
        this.notifier.notify(source, `Commande annulée.`);
    }

    @Rpc(RpcEvent.UPW_ORDER_VEHICLE)
    public async onOrderVehicle(source: number, model: string) {
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
            return;
        }
        const vehiclePrice = Math.ceil(vehicle.price * 0.01);
        const [transferred] = await this.bankService.transferBankMoney('upw', 'farm_upw', vehiclePrice);

        if (!transferred) {
            this.notifier.notify(
                source,
                `Il faut ~r~${vehiclePrice.toLocaleString()}$~s~ sur le compte de l'entreprise.`
            );
            return;
        } else {
            this.notifier.notify(source, `Virement de ~g~${vehiclePrice.toLocaleString()}$~s~ effectué.`);
        }

        const uuid = uuidv4();
        this.ordersInProgress.set(uuid, {
            uuid,
            model,
            orderDate: new Date().toISOString(),
        });

        this.notifier.notify(source, `Votre ${vehicle.model} arrive dans une heure.`);
    }

    private async addVehicle(model: string) {
        const vehicle = await this.prismaService.vehicle.findFirst({
            where: {
                model,
            },
        });
        let category = 'car';
        if (vehicle.requiredLicence === 'heli') {
            category = 'air';
        } else if (vehicle.requiredLicence === 'boat') {
            category = 'boat';
        }
        await this.prismaService.playerVehicle.create({
            data: {
                vehicle: model,
                hash: GetHashKey(model).toString(),
                mods: JSON.stringify(BennysConfig.UpgradeConfiguration),
                condition: JSON.stringify(getDefaultVehicleCondition()),
                plate: 'ESSAI ' + (this.orderedVehicle + 1),
                garage: 'upw',
                job: 'upw',
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

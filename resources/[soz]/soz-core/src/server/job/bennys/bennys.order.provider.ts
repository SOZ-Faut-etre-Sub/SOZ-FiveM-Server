import { BankService } from '../../../client/bank/bank.service';
import { OnEvent } from '../../../core/decorators/event';
import { Exportable } from '../../../core/decorators/exports';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick } from '../../../core/decorators/tick';
import { ServerEvent } from '../../../shared/event';
import { BennysConfig } from '../../../shared/job/bennys';
import { PrismaService } from '../../database/prisma.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

@Provider()
export class BennysOrderProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(BankService)
    private bankService: BankService;

    private ordersInProgress: Map<string, Date> = new Map();

    private orderedVehicle = 0;

    private async addVehicle(model: string) {
        const vehicle = await this.prismaService.vehicles.findFirst({
            where: {
                model,
            },
        });
        await this.prismaService.player_vehicles.create({
            data: {
                vehicle: model,
                hash: GetHashKey(model).toString(),
                mods: JSON.stringify(BennysConfig.Mods.upgradedSimplifiedMods),
                condition: '{}',
                plate: 'ESSAI ' + this.orderedVehicle,
                garage: 'bennys_luxury',
                job: 'bennys',
                category: vehicle.requiredLicence,
                fuel: 100,
                engine: 1000,
                body: 1000,
                state: 3,
                life_counter: 3,
            },
        });
        this.orderedVehicle++;
    }

    // Tick every minute to check the orders to complete.
    @Tick(1000 * 60)
    public async onTick() {
        for (const [model, lastOrder] of this.ordersInProgress.entries()) {
            if (lastOrder.getTime() + 1000 * 60 * 60 < Date.now()) {
                await this.addVehicle(model);
                this.ordersInProgress.delete(model);
            }
        }
    }

    @OnEvent(ServerEvent.BENNYS_ORDER_VEHICLE)
    public async onOrderVehicle(source: number, model: string) {
        const vehicle = await this.prismaService.vehicles.findFirst({
            where: {
                model,
                NOT: {
                    dealershipId: null,
                    price: 0,
                },
            },
        });
        if (!vehicle) {
            this.notifier.notify(source, `Ce modèle de véhicule n'est pas disponible.`);
            return;
        }
        const vehiclePrice = vehicle.price * 0.01;
        const [transferred] = await this.bankService.transferBankMoney('bennys', 'farm_bennys', vehiclePrice);

        if (!transferred) {
            this.notifier.notify(
                source,
                `Il faut ~r~${vehiclePrice.toLocaleString()}$~s~ sur le compte de l'entreprise.`
            );
            return;
        } else {
            this.notifier.notify(source, `Virement de ~g~${vehiclePrice.toLocaleString()}$~s~ effectué.`);
        }

        if (this.ordersInProgress.has(model)) {
            const lastOrder = this.ordersInProgress.get(model);
            if (lastOrder && lastOrder.getTime() + 1000 * 60 * 60 > Date.now()) {
                const leftMinutes = Math.floor((lastOrder.getTime() + 1000 * 60 * 60 - Date.now()) / 1000 / 60);
                this.notifier.notify(
                    source,
                    `Une livraison est déjà en cours, elle arrive dans ${leftMinutes} minute(s).`,
                    'warning'
                );
                return;
            }
        }
        this.ordersInProgress.set(model, new Date());

        this.notifier.notify(source, `Votre ${vehicle.model} arrive dans une heure.`);
    }

    @Exportable('deleteTestVehicles')
    async deleteTestVehicles() {
        await this.prismaService.player_vehicles.deleteMany({
            where: {
                plate: {
                    contains: 'ESSAI',
                },
            },
        });
    }
}

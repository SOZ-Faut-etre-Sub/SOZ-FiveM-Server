import { BankService } from '../../../client/bank/bank.service';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { isErr, isOk } from '../../../shared/result';
import { VehicleConfiguration } from '../../../shared/vehicle/modification';
import { PrismaService } from '../../database/prisma.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { EstimationService } from './estimationService';

@Provider()
export class BennysResellProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(EstimationService)
    private estimationService: EstimationService;

    @OnEvent(ServerEvent.BENNYS_SELL_VEHICLE)
    public async onSellVehicle(source: number, networkId: number, configuration: VehicleConfiguration) {
        const entity = NetworkGetEntityFromNetworkId(networkId);
        const hash = GetEntityModel(entity);
        const plate = GetVehicleNumberPlateText(entity).trim();

        if (plate.includes('ESSAI') || plate.includes('LUXE')) {
            this.notifier.notify(source, 'Vous ne pouvez pas vendre un véhicule de test.', 'error');
            return;
        }

        const vehicle = await this.prismaService.vehicle.findFirst({
            where: {
                hash: hash,
            },
        });

        if (!vehicle) {
            this.notifier.notify(source, `~r~Je peux pas vendre ce véhicule.`);
            return;
        }

        const playerVehicle = await this.prismaService.playerVehicle.findFirst({
            where: {
                plate: plate,
            },
        });
        if (!playerVehicle) {
            this.notifier.notify(source, `Désolé je reprends pas les véhicules volés.`, 'error');
            return;
        }

        const result = await this.estimationService.estimateVehicle(source, networkId, configuration);

        if (isErr(result)) {
            this.notifier.notify(source, result.err, 'error');
            return;
        }

        const sellPrice = result.ok / 2;

        const cashTransferResult = await this.bankService.transferCashMoney('bennys_reseller', source, sellPrice);
        if (isOk(cashTransferResult)) {
            this.notifier.notify(source, `Vous avez vendu ce véhicule pour ~g~$${sellPrice.toLocaleString()}~s~.`);
            DeleteEntity(entity);
            await this.prismaService.playerVehicle.delete({
                where: {
                    plate: plate,
                },
            });
            const player_purchase = await this.prismaService.player_purchases.findFirst({
                where: {
                    citizenid: playerVehicle.citizenid,
                    shop_type: 'dealership',
                    shop_id: 'luxury',
                    item_id: vehicle.model,
                },
            });

            if (player_purchase) {
                await this.prismaService.player_purchases.delete({
                    where: {
                        id: player_purchase.id,
                    },
                });
            }

            await this.prismaService.vehicle.update({
                where: {
                    model: vehicle.model,
                },
                data: {
                    stock: {
                        increment: 1,
                    },
                },
            });
        } else {
            this.notifier.notify(
                source,
                `Désolé mais je ne peux pas reprendre le véhicule pour le moment. Réessaye plus tard`,
                'error'
            );
        }
    }
}

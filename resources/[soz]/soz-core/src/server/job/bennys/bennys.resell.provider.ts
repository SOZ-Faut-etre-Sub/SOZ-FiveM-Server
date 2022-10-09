import { BankService } from '../../../client/bank/bank.service';
import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { PrismaService } from '../../database/prisma.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';

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

    @OnEvent(ServerEvent.BENNYS_SELL_VEHICLE)
    public async onSellVehicle(source: number, networkId: number) {
        const entity = NetworkGetEntityFromNetworkId(networkId);
        const hash = GetEntityModel(entity);
        const plate = GetVehicleNumberPlateText(entity);

        const vehicle = await this.prismaService.vehicles.findFirst({
            where: {
                hash: hash,
            },
        });

        if (!vehicle) {
            this.notifier.notify(source, `~r~Je peux pas vendre ce véhicule.`);
            return;
        }

        const playerVehicle = await this.prismaService.player_vehicles.findFirst({
            where: {
                plate: plate,
            },
        });
        if (!playerVehicle) {
            this.notifier.notify(source, `~r~Je n'ai pas de référence pour ce véhicule.`);
            return;
        }

        const sellPrice = vehicle.price / 2;

        const [hasTransferred] = await this.bankService.transferBankMoney('bennys_reseller', 'bennys', sellPrice);
        if (hasTransferred) {
            this.notifier.notify(source, `Vous avez vendu ce véhicule pour ~g~$${sellPrice.toLocaleString()}~s~.`);
            DeleteEntity(entity);
            this.prismaService.player_vehicles.delete({
                where: {
                    plate: plate,
                },
            });
            this.prismaService.concess_storage.update({
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

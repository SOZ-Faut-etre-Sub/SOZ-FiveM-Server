import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';

@Provider()
export class VehicleAdminProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PrismaService)
    private prisma: PrismaService;

    @OnEvent(ServerEvent.ADMIN_VEHICLE_SEE_CAR_PRICE)
    public async seeCarPrice(source: number, modelName: string): Promise<void> {
        if (!this.playerService.hasPermission(source, 'admin')) {
            return;
        }
        const vehicle = await this.prisma.vehicles.findFirst({
            where: {
                model: modelName,
            },
        });

        const message = `Prix du ~b~${modelName}~s~: ~g~${vehicle.price}`;
        this.notifier.notify(source, message, 'success');
    }

    @OnEvent(ServerEvent.ADMIN_VEHICLE_CHANGE_CAR_PRICE)
    public async changeCarPrice(source: number, modelName: string, price: number): Promise<void> {
        if (!this.playerService.hasPermission(source, 'admin')) {
            return;
        }
        await this.prisma.vehicles.update({
            data: {
                price: price,
            },
            where: {
                model: modelName,
            },
        });

        const message = `Nouveau prix du ~b~${modelName}~s~: ~g~${price}`;
        this.notifier.notify(source, message, 'success');
    }
}

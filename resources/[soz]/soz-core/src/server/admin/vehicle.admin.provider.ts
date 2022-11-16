import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class VehicleAdminProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PrismaService)
    private prisma: PrismaService;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    @OnEvent(ServerEvent.ADMIN_VEHICLE_SEE_CAR_PRICE)
    public async seeCarPrice(source: number, modelName: string): Promise<void> {
        if (!this.permissionService.isAdmin(source)) {
            return;
        }
        const vehicle = await this.prisma.vehicle.findFirst({
            where: {
                model: modelName,
            },
        });

        const message = `Prix du ~b~${modelName}~s~: ~g~${vehicle.price}`;
        this.notifier.notify(source, message, 'success');
    }

    @OnEvent(ServerEvent.ADMIN_VEHICLE_CHANGE_CAR_PRICE)
    public async changeCarPrice(source: number, modelName: string, price: number): Promise<void> {
        if (!this.permissionService.isAdmin(source)) {
            return;
        }
        await this.prisma.vehicle.update({
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

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { PrismaService } from '../../database/prisma.service';
import { QBCore } from '../../qbcore';

@Provider()
export class VehicleProvider {
    @Inject(QBCore)
    private qbCore: QBCore;

    @Inject(PrismaService)
    private prisma: PrismaService;

    @OnEvent(ServerEvent.ADMIN_VEHICLE_SEE_CAR_PRICE)
    public async seeCarPrice(source: number, modelName: string): Promise<void> {
        if (!this.qbCore.hasPermission(source, 'admin')) {
            return;
        }
        const vehicle = await this.prisma.vehicles.findFirst({
            where: {
                model: modelName,
            },
        });

        const message = `Prix du ~b~${modelName}~s~: ~g~${vehicle.price}`;
        TriggerClientEvent(ClientEvent.DRAW_NOTIFICATION, source, message);
    }

    @OnEvent(ServerEvent.ADMIN_VEHICLE_CHANGE_CAR_PRICE)
    public async changeCarPrice(source: number, modelName: string, price: number): Promise<void> {
        if (!this.qbCore.hasPermission(source, 'admin')) {
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
        TriggerClientEvent(ClientEvent.DRAW_NOTIFICATION, source, message);
    }
}

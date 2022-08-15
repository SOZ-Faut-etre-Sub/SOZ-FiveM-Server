import { Command } from '../../core/decorators/command';
import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class VehicleProvider {
    @Inject(PrismaService)
    private prisma: PrismaService;

    @Once()
    onStart(): void {
        console.log('Start vehicle provider');
    }

    @Command('seecarprice', { role: 'admin' })
    async seeCarPrice(source: number, modelName: string) {
        const vehicle = await this.prisma.vehicles.findFirst({
            where: {
                model: modelName,
            },
        });

        const message = `Prix du ~b~${modelName}~s~: ~g~${vehicle.price}`;
        TriggerClientEvent('hud:client:DrawNotification', source, message);
    }

    @Command('changecarprice', { role: 'admin' })
    async changeCarPrice(source: number, modelName: string, price: number) {
        await this.prisma.vehicles.update({
            data: {
                price: price,
            },
            where: {
                model: modelName,
            },
        });

        const message = `Nouveau prix du ~b~${modelName}~s~: ~g~${price}`;
        TriggerClientEvent('hud:client:DrawNotification', source, message);
    }
}

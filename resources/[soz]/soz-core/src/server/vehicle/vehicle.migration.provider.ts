import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class VehicleMigrationProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Once(OnceStep.DatabaseConnected)
    async migrate(): Promise<void> {
        await this.prismaService.vehicle.updateMany({
            where: {
                model: {
                    in: ['dynasty2', 'rumpo4'],
                },
            },
            data: {
                price: 24000,
            },
        });
    }
}

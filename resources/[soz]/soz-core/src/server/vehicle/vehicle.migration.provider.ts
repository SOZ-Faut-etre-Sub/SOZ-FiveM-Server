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
        const vehicles = await this.prismaService.playerVehicle.findMany({
            where: {
                plate: {
                    startsWith: 'BENY',
                },
            },
        });

        for (const vehicle of vehicles) {
            await this.prismaService.playerVehicle.update({
                where: {
                    id: vehicle.id,
                },
                data: {
                    plate: vehicle.plate.replace('BENY', 'NEWG'),
                },
            });
        }
    }
}

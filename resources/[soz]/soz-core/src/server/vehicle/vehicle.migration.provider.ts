import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PlaceCapacity } from '../../shared/vehicle/garage';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class VehicleMigrationProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Once(OnceStep.DatabaseConnected)
    async migrate(): Promise<void> {
        await this.prismaService.vehicle.updateMany({
            where: {
                model: 'pbus2',
            },
            data: {
                size: PlaceCapacity.Large,
            },
        });
    }
}

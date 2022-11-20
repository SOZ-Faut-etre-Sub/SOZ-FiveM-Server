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

        await this.prismaService.vehicle.updateMany({
            where: {
                model: {
                    in: [
                        'ambulance',
                        'ambcar',
                        'firetruk',
                        'mule6',
                        'taco1',
                        'dynasty2',
                        'trash',
                        'stockade',
                        'baller8',
                        'packer2',
                        'utillitruck4',
                        'flatbed3',
                        'flatbed4',
                        'burito6',
                        'newsvan',
                        'frogger3',
                        'police',
                        'police2',
                        'police3',
                        'police4',
                        'police5',
                        'police6',
                        'policeb2',
                        'sheriff',
                        'sheriff2',
                        'sheriff3',
                        'sheriff4',
                        'sheriffb',
                        'maverick2',
                        'pbus',
                        'polmav',
                        'fbi',
                        'fbi2',
                        'cogfbi',
                        'paragonfbi',
                        'sadler1',
                        'hauler1',
                        'brickade1',
                        'boxville',
                        'youga3',
                        'rumpo4',
                    ],
                },
            },
            data: {
                radio: true,
            },
        });
    }
}

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { PrismaService } from '../../database/prisma.service';

@Provider()
export class BennysSpecialVehicleProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Once(OnceStep.Start)
    public async onStart() {
        await this.prismaService.playerVehicle.deleteMany({
            where: {
                plate: {
                    startsWith: 'ESSAI',
                },
            },
        });
    }
}

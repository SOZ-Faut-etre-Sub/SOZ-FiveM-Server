import { Inject, Injectable } from '../../core/decorators/injectable';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VehiclePlayerRepository {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public async find(id: number) {
        return this.prismaService.PlayerVehicle.findUnique({
            where: {
                id,
            },
        });
    }
}

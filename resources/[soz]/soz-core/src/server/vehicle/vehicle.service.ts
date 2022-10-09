import { Inject, Injectable } from '../../core/decorators/injectable';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VehicleService {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public getVehicle(hash: number) {
        return this.prismaService.vehicles.findFirst({
            where: {
                hash,
            },
        });
    }
}

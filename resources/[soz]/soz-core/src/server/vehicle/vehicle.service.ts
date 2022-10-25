import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PrismaService } from '../database/prisma.service';

@Provider()
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

    public async generatePlate(): Promise<string> {
        let plate;
        do {
            plate = Math.random().toString(36).slice(2, 10).toUpperCase();
        } while (await this.prismaService.playerVehicle.findFirst({ where: { plate: plate } }));
        return plate;
    }
}

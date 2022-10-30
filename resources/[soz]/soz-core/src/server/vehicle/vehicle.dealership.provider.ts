import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';
import { Vehicle } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class VehicleDealershipProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Rpc(RpcEvent.VEHICLE_DEALERSHIP_GET_LIST)
    public async getDealershipList(source: number, id: string): Promise<Vehicle[]> {
        const vehicles = await this.prismaService.vehicles.findMany({
            where: {
                dealershipId: id,
                stock: {
                    gt: 0,
                },
            },
        });

        return vehicles;
    }
}

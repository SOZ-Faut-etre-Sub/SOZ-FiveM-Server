import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class AdminMenuVehicleProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Rpc(RpcEvent.ADMIN_GET_VEHICLES)
    public async getVehicles(): Promise<any[]> {
        return await this.prismaService.vehicles.findMany();
    }
}

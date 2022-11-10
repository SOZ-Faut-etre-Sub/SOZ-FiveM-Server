import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { JobType } from '../../shared/job';
import { RpcEvent } from '../../shared/rpc';
import { Vehicle, VehicleMaxStock } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class AdminMenuVehicleProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Rpc(RpcEvent.ADMIN_GET_VEHICLES)
    public async getVehicles(): Promise<Vehicle[]> {
        return (await this.prismaService.vehicle.findMany())
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(v => ({
                ...v,
                jobName: JSON.parse(v.jobName) as { [key in JobType]: string },
                maxStock: VehicleMaxStock[v.category],
            }));
    }
}

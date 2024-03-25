import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event';
import { JobType } from '../../shared/job';
import { RpcServerEvent } from '../../shared/rpc';
import { Vehicle } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { VehicleSpawner } from '../vehicle/vehicle.spawner';
import { VehicleStateService } from '../vehicle/vehicle.state.service';

@Provider()
export class AdminMenuVehicleProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Rpc(RpcServerEvent.ADMIN_GET_VEHICLES)
    public async getVehicles(): Promise<Vehicle[]> {
        return (await this.prismaService.vehicle.findMany())
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(v => ({
                ...v,
                jobName: JSON.parse(v.jobName) as { [key in JobType]: string },
                handling: v.handling ? JSON.parse(v.handling) : null,
            }));
    }

    @OnEvent(ServerEvent.ADMIN_VEHICLE_SPAWN)
    public async spawnVehicle(source: number, model: string) {
        await this.vehicleSpawner.spawnTemporaryVehicle(source, model);
    }

    @OnEvent(ServerEvent.ADMIN_VEHICLE_DELETE)
    public async deleteVehicle(source: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (closestVehicle !== null) {
            await this.vehicleSpawner.delete(closestVehicle.vehicleNetworkId);
        }
    }

    @OnEvent(ServerEvent.ADMIN_VEHICLE_NOS)
    public async addNOS(source: number, netId: number) {
        if (!this.permissionService.isGameMaster(source)) {
            return;
        }

        this.vehicleStateService.updateVehicleCondition(netId, { nitro: 3 });
        this.notifier.notify(source, '~g~3 kits NOS~s~ ont été installé sur le véhicule.');
    }
}

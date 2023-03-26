import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { VehicleSpawner } from './vehicle.spawner';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleCommandProvider {
    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Command('car', { role: ['staff', 'admin'], description: 'Spawn Vehicle (Admin Only)' })
    async createCarCommand(source: number, model: string) {
        const spawned = await this.vehicleSpawner.spawnTemporaryVehicle(source, model);

        if (!spawned) {
            console.log('Vehicle could not be spawned');
        }
    }
    @Command('dv', { role: ['staff', 'admin'], description: 'Delete Vehicle (Admin Only)' })
    async deleteCarCommand(source: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (closestVehicle !== null) {
            await this.vehicleSpawner.delete(closestVehicle.vehicleNetworkId);
        }
    }

    @Command('yolo', { role: ['admin'], description: 'Delete Vehicle (Admin Only)' })
    async yoloCommand(source: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);
        const state = this.vehicleStateService.getVehicleState(closestVehicle.vehicleEntityId);

        if (state) {
            this.vehicleStateService.updateVehicleState(closestVehicle.vehicleEntityId, {
                yoloMode: !state.yoloMode,
            });
        }
    }

    @Command('dirty', { role: ['admin'], description: 'Set vehicle dirty (Admin Only)' })
    async dirtyCommand(source: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);
        const owner = NetworkGetEntityOwner(closestVehicle.vehicleEntityId);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, closestVehicle.vehicleNetworkId, {
            dirtLevel: 15.0,
        });
    }

    @Command('fuel', { role: ['admin'], description: 'Set fuel level (Admin Only)' })
    async fuelCommand(source: number, newlevel: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);
        const state = this.vehicleStateService.getVehicleState(closestVehicle.vehicleEntityId);

        if (state) {
            this.vehicleStateService.updateVehicleState(closestVehicle.vehicleEntityId, {
                condition: {
                    ...state.condition,
                    fuelLevel: newlevel,
                },
            });
        }
    }
}

import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { ClientEvent } from '../../shared/event';
import { VehicleSpawner } from './vehicle.spawner';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleCommandProvider {
    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(Logger)
    private logger: Logger;

    @Command('car', { role: ['staff', 'admin'], description: 'Spawn Vehicle (Admin Only)' })
    async createCarCommand(source: number, model: string) {
        const spawned = await this.vehicleSpawner.spawnTemporaryVehicle(source, model);

        if (!spawned) {
            this.logger.error(`Vehicle ${model} could not be spawned`);
        }
    }
    @Command('dv', { role: ['staff', 'admin'], description: 'Delete Vehicle (Admin Only)' })
    async deleteCarCommand(source: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        if (closestVehicle !== null) {
            await this.vehicleSpawner.delete(closestVehicle.vehicleNetworkId);
        }
    }

    @Command('dirty', { role: ['admin'], description: 'Set vehicle dirty (Admin Only)' })
    async dirtyCommand(source: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            dirtLevel: 15.0,
        });
    }

    @Command('fuel', { role: ['admin'], description: 'Set fuel level (Admin Only)' })
    async fuelCommand(source: number, newlevel: number) {
        const closestVehicle = await this.vehicleSpawner.getClosestVehicle(source);

        this.vehicleStateService.updateVehicleCondition(closestVehicle.vehicleNetworkId, {
            fuelLevel: newlevel,
        });
    }
}

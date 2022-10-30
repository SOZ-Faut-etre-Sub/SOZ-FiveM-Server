import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { VehicleSpawner } from './vehicle.spawner';

@Provider()
export class VehicleCommandProvider {
    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

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
}

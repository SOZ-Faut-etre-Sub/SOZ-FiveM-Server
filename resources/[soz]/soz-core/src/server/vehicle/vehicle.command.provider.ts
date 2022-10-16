import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
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
        /**
         * local ped = PlayerPedId()
         *     local veh = GetVehiclePedIsUsing(ped)
         *     if veh ~= 0 then
         *         SetEntityAsMissionEntity(veh, true, true)
         *         DeleteVehicle(veh)
         *     else
         *         local pcoords = GetEntityCoords(ped)
         *         local vehicles = GetGamePool('CVehicle')
         *         for k, v in pairs(vehicles) do
         *             if #(pcoords - GetEntityCoords(v)) <= 5.0 then
         *                 SetEntityAsMissionEntity(v, true, true)
         *                 DeleteVehicle(v)
         *             end
         *         end
         *     end
         */
        const ped = GetPlayerPed(source);
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (vehicle !== 0) {
            const networkId = NetworkGetNetworkIdFromEntity(vehicle);

            await this.vehicleSpawner.delete(networkId);
        }
    }
}

import { Module } from '../../core/decorators/module';
import { VehicleAdminProvider } from '../admin/vehicle.admin.provider';
import { VehicleCommandProvider } from './vehicle.command.provider';
import { VehicleGarageProvider } from './vehicle.garage.provider';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleProvider } from './vehicle.provider';
import { VehicleSpawner } from './vehicle.spawner';
import { VehicleStateProvider } from './vehicle.state.provider';

@Module({
    providers: [
        VehicleAdminProvider,
        VehicleCommandProvider,
        VehicleGarageProvider,
        VehicleLockProvider,
        VehicleProvider,
        VehicleSpawner,
        VehicleStateProvider,
    ],
})
export class VehicleModule {}

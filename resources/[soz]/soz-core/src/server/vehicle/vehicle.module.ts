import { Module } from '../../core/decorators/module';
import { VehicleAdminProvider } from '../admin/vehicle.admin.provider';
import { VehicleCommandProvider } from './vehicle.command.provider';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleProvider } from './vehicle.provider';
import { VehicleSpawner } from './vehicle.spawner';

@Module({
    providers: [VehicleAdminProvider, VehicleProvider, VehicleCommandProvider, VehicleSpawner, VehicleLockProvider],
})
export class VehicleModule {}

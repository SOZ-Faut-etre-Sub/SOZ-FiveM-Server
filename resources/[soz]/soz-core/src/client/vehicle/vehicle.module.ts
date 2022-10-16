import { Module } from '../../core/decorators/module';
import { VehicleLockProvider } from './vehicle.lock.provider';
import { VehicleSpawnProvider } from './vehicle.spawn.provider';

@Module({
    providers: [VehicleLockProvider, VehicleSpawnProvider],
})
export class VehicleModule {}

import { Module } from '../../core/decorators/module';
import { VehicleLockProvider } from './vehicle.lock.provider';

@Module({
    providers: [VehicleLockProvider],
})
export class VehicleModule {}

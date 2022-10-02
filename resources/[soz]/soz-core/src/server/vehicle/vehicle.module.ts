import { Module } from '../../core/decorators/module';
import { VehicleAdminProvider } from '../admin/vehicle.admin.provider';
import { VehicleProvider } from './vehicle.provider';

@Module({
    providers: [VehicleAdminProvider, VehicleProvider],
})
export class VehicleModule {}

import { Module } from '../../core/decorators/module';
import { VehicleAdminProvider } from '../admin/vehicle.admin.provider';

@Module({
    providers: [VehicleAdminProvider],
})
export class VehicleModule {}

import { Module } from '../../../core/decorators/module';
import { VehicleProvider } from './vehicle.provider';

@Module({
    providers: [VehicleProvider],
})
export class VehicleModule {}

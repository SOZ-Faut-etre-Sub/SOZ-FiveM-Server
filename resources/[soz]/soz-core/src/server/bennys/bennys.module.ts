import { Module } from '../../core/decorators/module';
import { BennysSpecialVehicleProvider } from './bennys.special-vehicle.provider';

@Module({
    providers: [BennysSpecialVehicleProvider],
})
export class BennysModule {}

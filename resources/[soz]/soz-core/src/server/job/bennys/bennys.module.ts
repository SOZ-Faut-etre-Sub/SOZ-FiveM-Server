import { Module } from '../../../core/decorators/module';
import { BennysEstimateProvider } from './bennys.estimate.provider';
import { BennysOrderProvider } from './bennys.order.provider';
import { BennysResellProvider } from './bennys.resell.provider';
import { BennysSpecialVehicleProvider } from './bennys.special-vehicle.provider';
import { BennysVehicleProvider } from './bennys.vehicle.provider';

@Module({
    providers: [
        BennysEstimateProvider,
        BennysOrderProvider,
        BennysResellProvider,
        BennysSpecialVehicleProvider,
        BennysVehicleProvider,
    ],
})
export class BennysModule {}

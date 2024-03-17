import { Module } from '../../../core/decorators/module';
import { BennysEstimateProvider } from './bennys.estimate.provider';
import { BennysFlatbedProvider } from './bennys.flatbed.provider';
import { BennysResellProvider } from './bennys.resell.provider';
import { BennysVehicleProvider } from './bennys.vehicle.provider';

@Module({
    providers: [BennysEstimateProvider, BennysFlatbedProvider, BennysResellProvider, BennysVehicleProvider],
})
export class BennysModule {}

import { Module } from '../../../core/decorators/module';
import { BennysCloakroomProvider } from './bennys.cloakroom.provider';
import { BennysEstimateProvider } from './bennys.estimate.provider';
import { BennysFlatbedProvider } from './bennys.flatbed.provider';
import { BennysOrderProvider } from './bennys.order.provider';
import { BennysResellProvider } from './bennys.resell.provider';
import { BennysVehicleProvider } from './bennys.vehicle.provider';

@Module({
    providers: [
        BennysCloakroomProvider,
        BennysEstimateProvider,
        BennysFlatbedProvider,
        BennysOrderProvider,
        BennysResellProvider,
        BennysVehicleProvider,
    ],
})
export class BennysModule {}

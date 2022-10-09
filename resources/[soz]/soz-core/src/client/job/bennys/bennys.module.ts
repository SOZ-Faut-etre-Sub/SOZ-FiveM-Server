import { Module } from '../../../core/decorators/module';
import { BennysEstimateProvider } from './bennys.estimate.provider';
import { BennysOrderProvider } from './bennys.order.provider';
import { BennysResellProvider } from './bennys.resell.provider';

@Module({
    providers: [BennysEstimateProvider, BennysOrderProvider, BennysResellProvider],
})
export class BennysModule {}

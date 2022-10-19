import { Module } from '../../../core/decorators/module';
import { StonkCollectProvider } from './stonk.collect.provider';
import { StonkDeliveryProvider } from './stonk.delivery.provider';
import { StonkProvider } from './stonk.provider';
import { StonkResellProvider } from './stonk.resell.provider';

@Module({
    providers: [StonkProvider, StonkResellProvider, StonkCollectProvider, StonkDeliveryProvider],
})
export class StonkModule {}

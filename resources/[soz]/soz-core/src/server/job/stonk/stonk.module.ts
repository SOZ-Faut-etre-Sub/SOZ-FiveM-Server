import { Module } from '../../../core/decorators/module';
import { StonkCollectProvider } from './stonk.collect.provider';
import { StonkDeliveryProvider } from './stonk.delivery.provider';
import { StonkFillInProvider } from './stonk.fill-in.provider';
import { StonkResellProvider } from './stonk.resell.provider';

@Module({
    providers: [StonkResellProvider, StonkCollectProvider, StonkFillInProvider, StonkDeliveryProvider],
})
export class StonkModule {}

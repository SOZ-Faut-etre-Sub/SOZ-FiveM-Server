import { Module } from '../../../core/decorators/module';
import { StonkCollectProvider } from './stonk.collect.provider';
import { StonkResellProvider } from './stonk.resell.provider';

@Module({
    providers: [StonkResellProvider, StonkCollectProvider],
})
export class StonkModule {}

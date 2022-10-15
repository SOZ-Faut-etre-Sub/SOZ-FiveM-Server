import { Module } from '../../../core/decorators/module';
import { StonkProvider } from './stonk.provider';
import { StonkResellProvider } from './stonk.resell.provider';

@Module({
    providers: [StonkProvider, StonkResellProvider],
})
export class StonkModule {}

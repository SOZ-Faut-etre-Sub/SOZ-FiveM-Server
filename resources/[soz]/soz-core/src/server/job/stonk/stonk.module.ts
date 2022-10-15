import { Module } from '../../../core/decorators/module';
import { StonkResellProvider } from './stonk.resell.provider';

@Module({
    providers: [StonkResellProvider],
})
export class StonkModule {}

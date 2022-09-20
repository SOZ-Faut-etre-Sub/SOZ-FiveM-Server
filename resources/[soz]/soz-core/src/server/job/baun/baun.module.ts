import { Module } from '../../../core/decorators/module';
import { BaunCraftProvider } from './baun.craft.provider';
import { BaunResellProvider } from './baun.resell.provider';

@Module({
    providers: [BaunCraftProvider, BaunResellProvider],
})
export class BaunModule {}

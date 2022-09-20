import { Module } from '../../../core/decorators/module';
import { BaunCraftProvider } from './baun.craft.provider';
import { BaunProvider } from './baun.provider';
import { BaunResellProvider } from './baun.resell.provider';

@Module({
    providers: [BaunProvider, BaunCraftProvider, BaunResellProvider],
})
export class BaunModule {}

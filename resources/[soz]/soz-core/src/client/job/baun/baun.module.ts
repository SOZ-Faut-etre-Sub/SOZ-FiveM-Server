import { Module } from '../../../core/decorators/module';
import { BaunCraftProvider } from './baun.craft.provider';
import { BaunProvider } from './baun.provider';
import { BaunResellProvider } from './baun.resell.provider';
import { BaunCofeProvider } from './baun.cofe.provider';

@Module({
    providers: [BaunProvider, BaunCraftProvider, BaunResellProvider, BaunCofeProvider],
})
export class BaunModule {}

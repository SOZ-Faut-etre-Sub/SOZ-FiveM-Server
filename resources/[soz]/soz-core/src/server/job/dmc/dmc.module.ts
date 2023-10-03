import { Module } from '../../../core/decorators/module';
import { DmcForgeProvider } from './dmc.forge.provider';
import { DmcHarvestProvider } from './dmc.harvest.provider';
import { DmcRestockProvider } from './dmc.restock.provider';

@Module({
    providers: [DmcHarvestProvider, DmcForgeProvider, DmcRestockProvider],
})
export class DMCModule {}

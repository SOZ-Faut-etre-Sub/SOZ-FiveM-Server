import { Module } from '../../../core/decorators/module';
import { DmcHarvestProvider } from './dmc.harvest.provider';
import { DmcProvider } from './dmc.provider';
import { DmcRestockProvider } from './dmc.restock.provider';

@Module({
    providers: [DmcHarvestProvider, DmcProvider, DmcRestockProvider],
})
export class DMCModule {}

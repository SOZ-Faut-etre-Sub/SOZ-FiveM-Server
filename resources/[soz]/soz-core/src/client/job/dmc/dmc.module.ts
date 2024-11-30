import { Module } from '../../../core/decorators/module';
import { DmcHarvestProvider } from './dmc.harvest.provider';
import { DmcProvider } from './dmc.provider';

@Module({
    providers: [DmcHarvestProvider, DmcProvider],
})
export class DMCModule {}

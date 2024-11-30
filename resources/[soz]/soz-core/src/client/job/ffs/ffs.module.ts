import { Module } from '../../../core/decorators/module';
import { FightForStyleCraftProvider } from './ffs.craft.provider';
import { FightForStyleHarvestProvider } from './ffs.harvest.provider';
import { FightForStyleProvider } from './ffs.provider';

@Module({
    providers: [FightForStyleHarvestProvider, FightForStyleCraftProvider, FightForStyleProvider],
})
export class FightForStyleModule {}

import { Module } from '../../../core/decorators/module';
import { FightForStyleCraftProvider } from './ffs.craft.provider';
import { FightForStyleHarvestProvider } from './ffs.harvest.provider';
import { FightForStyleTransformProvider } from './ffs.transform.provider';

@Module({
    providers: [FightForStyleHarvestProvider, FightForStyleTransformProvider, FightForStyleCraftProvider],
})
export class FightForStyleModule {}

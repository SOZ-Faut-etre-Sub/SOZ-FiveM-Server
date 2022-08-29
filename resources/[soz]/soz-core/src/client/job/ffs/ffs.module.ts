import { Module } from '../../../core/decorators/module';
import { FightForStyleCraftProvider } from './ffs.craft.provider';
import { FightForStyleHarvestProvider } from './ffs.harvest.provider';
import { FightForStyleProvider } from './ffs.provider';
import { FightForStyleRestockProvider } from './ffs.restock.provider';
import { FightForStyleTransformProvider } from './ffs.transform.provider';

@Module({
    providers: [
        FightForStyleHarvestProvider,
        FightForStyleTransformProvider,
        FightForStyleCraftProvider,
        FightForStyleRestockProvider,
        FightForStyleProvider,
    ],
})
export class FightForStyleModule {}

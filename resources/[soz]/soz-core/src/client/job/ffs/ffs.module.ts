import { Module } from '../../../core/decorators/module';
import { FightForStyleCraftProvider } from './ffs.craft.provider';
import { FightForStyleHarvestProvider } from './ffs.harvest.provider';
import { FightForStyleProvider } from './ffs.provider';
import { FightForStyleRestockProvider } from './ffs.restock.provider';

@Module({
    providers: [
        FightForStyleHarvestProvider,
        FightForStyleCraftProvider,
        FightForStyleRestockProvider,
        FightForStyleProvider,
    ],
})
export class FightForStyleModule {}

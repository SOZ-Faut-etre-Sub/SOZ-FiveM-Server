import { Module } from '../../../core/decorators/module';
import { FightForStyleHarvestProvider } from './ffs.harvest.provider';
import { FightForStyleRestockProvider } from './ffs.restock.provider';

@Module({
    providers: [FightForStyleHarvestProvider, FightForStyleRestockProvider],
})
export class FightForStyleModule {}

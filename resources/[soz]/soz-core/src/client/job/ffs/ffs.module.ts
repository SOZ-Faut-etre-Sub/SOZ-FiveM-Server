import { Module } from '../../../core/decorators/module';
import { FightForStyleHarvestProvider } from './ffs.harvest.provider';
import { FightForStyleTransformProvider } from './ffs.transform.provider';

@Module({
    providers: [FightForStyleHarvestProvider, FightForStyleTransformProvider],
})
export class FightForStyleModule {}

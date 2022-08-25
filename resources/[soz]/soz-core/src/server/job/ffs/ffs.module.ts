import { Module } from '../../../core/decorators/module';
import { FightForStyleProvider } from './ffs.provider';

@Module({
    providers: [FightForStyleProvider],
})
export class FightForStyleModule {}

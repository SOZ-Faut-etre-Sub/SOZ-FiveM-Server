import { Module } from '../../../core/decorators/module';
import { PoliceProvider } from './police.provider';

@Module({
    providers: [PoliceProvider],
})
export class PoliceModule {}

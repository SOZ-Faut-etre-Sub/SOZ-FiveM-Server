import { Module } from '../../../core/decorators/module';
import { PoliceProvider } from './police.provider';
import { PoliceSirenProvider } from './police.siren.provider';

@Module({
    providers: [PoliceProvider, PoliceSirenProvider],
})
export class PoliceModule {}

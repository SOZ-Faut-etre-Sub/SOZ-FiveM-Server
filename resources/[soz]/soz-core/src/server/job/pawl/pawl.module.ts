import { Module } from '@public/core/decorators/module';

import { PawlDegradationProvider } from './pawl.degradation.provider';
import { PawlFieldProvider } from './pawl.field.provider';
import { PawlHarvestProvider } from './pawl.harvest.provider';
import { PawlProcessingProvider } from './pawl.processing.provider';

@Module({
    providers: [PawlDegradationProvider, PawlFieldProvider, PawlHarvestProvider, PawlProcessingProvider],
})
export class PawlModule {}

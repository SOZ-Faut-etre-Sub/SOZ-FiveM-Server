import { Module } from '@public/core/decorators/module';

import { PawlHarvestProvider } from './pawl.harvest.provider';

@Module({
    providers: [PawlHarvestProvider],
})
export class PawlModule {}

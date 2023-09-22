import { Module } from '@public/core/decorators/module';

import { PawlCraftProvider } from './pawl.craft.provider';
import { PawlHarvestProvider } from './pawl.harvest.provider';

@Module({
    providers: [PawlHarvestProvider, PawlCraftProvider],
})
export class PawlModule {}

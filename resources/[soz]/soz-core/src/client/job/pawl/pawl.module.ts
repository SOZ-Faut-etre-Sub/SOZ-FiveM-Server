import { Module } from '@public/core/decorators/module';

import { PawlCraftProvider } from './pawl.craft.provider';
import { PawlHarvestProvider } from './pawl.harvest.provider';
import { PawlProvider } from './pawl.provider';
import { PawlResellProvider } from './pawl.resell.provider';

@Module({
    providers: [PawlHarvestProvider, PawlCraftProvider, PawlProvider, PawlResellProvider],
})
export class PawlModule {}

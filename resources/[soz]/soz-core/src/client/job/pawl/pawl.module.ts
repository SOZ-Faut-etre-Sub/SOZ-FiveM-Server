import { Module } from '@public/core/decorators/module';

import { PawlCraftProvider } from './pawl.craft.provider';
import { PawlHarvestProvider } from './pawl.harvest.provider';
import { PawlMenuProvider } from './pawl.menu.provider';
import { PawlProcessingProvider } from './pawl.processing.provider';
import { PawlProvider } from './pawl.provider';
import { PawlResellProvider } from './pawl.resell.provider';

@Module({
    providers: [
        PawlCraftProvider,
        PawlHarvestProvider,
        PawlMenuProvider,
        PawlProcessingProvider,
        PawlProvider,
        PawlResellProvider,
    ],
})
export class PawlModule {}

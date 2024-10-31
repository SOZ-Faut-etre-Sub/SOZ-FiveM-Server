import { Module } from '@core/decorators/module';

import { FDFFieldProvider } from './fdf.field.provider';
import { FDFHarvestProvider } from './fdf.harvest.provider';
import { FDFTreeProvider } from './fdf.tree.provider';

@Module({
    providers: [FDFTreeProvider, FDFFieldProvider, FDFHarvestProvider],
})
export class FDFModule {}

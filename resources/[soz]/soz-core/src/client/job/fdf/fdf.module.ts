import { Module } from '@core/decorators/module';

import { FDFFieldProvider } from './fdf.field.provider';
import { FDFProvider } from './fdf.provider';
import { FDFTreeProvider } from './fdf.tree.provider';

@Module({
    providers: [FDFProvider, FDFTreeProvider, FDFFieldProvider],
})
export class FDFModule {}

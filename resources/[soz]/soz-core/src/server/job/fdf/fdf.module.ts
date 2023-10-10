import { Module } from '@core/decorators/module';

import { FDFFieldProvider } from './fdf.field.provider';
import { FDFTreeProvider } from './fdf.tree.provider';

@Module({
    providers: [FDFTreeProvider, FDFFieldProvider],
})
export class FDFModule {}

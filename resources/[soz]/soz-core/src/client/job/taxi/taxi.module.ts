import { Module } from '@core/decorators/module';

import { TaxiMenuProvider } from './menu.taxi.provider';
import { TaxiProvider } from './taxi.provider';

@Module({
    providers: [TaxiProvider, TaxiMenuProvider],
})
export class TaxiModule {}

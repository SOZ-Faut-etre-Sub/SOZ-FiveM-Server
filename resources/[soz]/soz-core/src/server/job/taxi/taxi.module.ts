import { Module } from '../../../core/decorators/module';
import { TaxiProvider } from './taxi.provider';

@Module({
    providers: [TaxiProvider],
})
export class TaxiModule {}

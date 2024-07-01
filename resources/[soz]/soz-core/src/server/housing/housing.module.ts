import { Module } from '../../core/decorators/module';
import { HousingFournitureProvider } from './housing.fourniture.provider';
import { HousingProvider } from './housing.provider';

@Module({
    providers: [HousingProvider, HousingFournitureProvider],
})
export class HousingModule {}

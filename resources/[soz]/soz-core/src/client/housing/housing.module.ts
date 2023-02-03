import { Module } from '../../core/decorators/module';
import { HousingProvider } from './housing.provider';

@Module({
    providers: [HousingProvider],
})
export class HousingModule {}

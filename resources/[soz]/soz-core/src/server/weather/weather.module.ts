import { Module } from '../../core/decorators/module';
import { WeatherProvider } from './weather.provider';

@Module({
    providers: [WeatherProvider],
})
export class WeatherModule {}

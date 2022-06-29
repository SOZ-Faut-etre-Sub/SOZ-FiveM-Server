import { Module } from '../../core/decorators/module';
import { BlackoutProvider } from './blackout.provider';
import { SnowProvider } from './snow.provider';
import { TimeProvider } from './time.provider';
import { WeatherProvider } from './weather.provider';

@Module({
    providers: [BlackoutProvider, SnowProvider, WeatherProvider, TimeProvider],
})
export class WeatherModule {}

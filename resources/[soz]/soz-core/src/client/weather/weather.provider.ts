import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';
import { Weather } from '../../shared/weather';

@Provider()
export class WeatherProvider {
    @StateBagHandler('weather', 'global')
    async onWeatherChange(_name, _key, weather: Weather) {
        SetWeatherOwnedByNetwork(false);
        SetWeatherTypeOvertimePersist(weather, 60.0);
    }

    @Once()
    onStart(): void {
        SetWeatherOwnedByNetwork(false);
        SetWeatherTypeOvertimePersist(GlobalState.weather, 60.0);
    }
}

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Weather } from '../../shared/weather';
import { StateSelector, Store } from '../store/store';

@Provider()
export class WeatherProvider {
    @Inject('Store')
    private store: Store;

    @StateSelector(state => state.global.weather)
    async onWeatherChange(weather: Weather) {
        SetWeatherTypeOvertimePersist(weather, 60.0);
    }

    @Once()
    onStart(): void {
        SetWeatherOwnedByNetwork(false);
    }
}

import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Weather } from '../../shared/weather';
import { ResourceLoader } from '../repository/resource.loader';
import { StateSelector } from '../store/store';

@Provider()
export class WeatherProvider {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @StateSelector(state => state.global.weather)
    async onWeatherChange(weather: Weather) {
        SetWeatherTypeOvertimePersist(weather, 60.0);
    }

    @StateSelector(state => state.global.halloween)
    async onHalloween(halloween: string) {
        if (halloween) {
            await this.resourceLoader.loadStreamedTextureDict('halloweenmoon');
            SetTransitionTimecycleModifier(halloween, 30.05);
            AddReplaceTexture('platform:/textures/skydome', 'moon-new', 'halloweenmoon', 'moon-new');
        } else {
            SetTransitionTimecycleModifier('default', 30.05);
            RemoveReplaceTexture('platform:/textures/skydome', 'moon-new');
        }
    }

    @StateSelector(state => state.global.rain)
    async onRain(rain: number) {
        SetRainLevel(rain);
    }

    @Once()
    onStart(): void {
        SetWeatherOwnedByNetwork(false);
    }
}

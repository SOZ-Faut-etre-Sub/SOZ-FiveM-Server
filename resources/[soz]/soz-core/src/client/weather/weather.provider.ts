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
    async onHalloween(halloween: boolean) {
        if (halloween) {
            await this.resourceLoader.loadStreamedTextureDict('halloweenmoon');
            SetTransitionTimecycleModifier('li', 120.0);
            AddReplaceTexture('platform:/textures/skydome', 'moon-new', 'halloweenmoon', 'moon-new');
            AddReplaceTexture('platform:/textures/skydome', 'starfield', 'halloweenmoon', 'starfield');
        } else {
            ClearTimecycleModifier();
            RemoveReplaceTexture('platform:/textures/skydome', 'moon-new');
            RemoveReplaceTexture('platform:/textures/skydome', 'starfield');
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

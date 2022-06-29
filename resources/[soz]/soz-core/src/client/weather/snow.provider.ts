import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';
import { Weather } from '../../shared/weather';
import { ResourceLoader } from '../resources/resource.loader';

const WEATHER_WITH_SNOW: Weather[] = ['BLIZZARD', 'SNOWLIGHT', 'SNOW'];

@Provider()
export class SnowProvider {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    async applySnowForWeather(weather: Weather) {
        const applySnow = WEATHER_WITH_SNOW.includes(weather);

        ForceSnowPass(applySnow);
        SetForceVehicleTrails(applySnow);
        SetForcePedFootstepsTracks(applySnow);

        if (applySnow) {
            await this.resourceLoader.loadPtfxAsset('core_snow');

            UseParticleFxAssetNextCall('core_snow');
        } else {
            this.resourceLoader.unloadedPtfxAsset('core_snow');
        }
    }

    @StateBagHandler('weather', 'global')
    async onWeatherChange(_name, _key, weather: Weather) {
        await this.applySnowForWeather(weather);
    }

    @Once()
    async onStart() {
        await this.applySnowForWeather(GlobalState.weather);
    }
}

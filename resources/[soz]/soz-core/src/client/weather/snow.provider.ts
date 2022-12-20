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

    async applySnowForWeather(weather: Weather, needSnow?: boolean) {
        const applySnow = needSnow || WEATHER_WITH_SNOW.includes(weather);

        ForceSnowPass(applySnow);
        SetForceVehicleTrails(applySnow);
        SetForcePedFootstepsTracks(applySnow);

        if (applySnow) {
            await this.resourceLoader.loadPtfxAsset('core_snow');

            UseParticleFxAssetNextCall('core_snow');
        } else {
            this.resourceLoader.unloadPtfxAsset('core_snow');
        }
    }

    @StateBagHandler('weather', 'global')
    async onWeatherChange(_name, _key, weather: Weather) {
        await this.applySnowForWeather(weather, GlobalState.snow);
    }

    @StateBagHandler('snow', 'global')
    async onSnowChange(_name, _key, needSnow: boolean) {
        await this.applySnowForWeather(GlobalState.weather, needSnow);
    }

    @Once()
    async onStart() {
        await this.applySnowForWeather(GlobalState.weather, GlobalState.snow);
    }
}

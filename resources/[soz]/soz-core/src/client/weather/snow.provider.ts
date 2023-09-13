import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Weather } from '../../shared/weather';
import { ResourceLoader } from '../repository/resource.loader';
import { StateSelector, Store } from '../store/store';

const WEATHER_WITH_SNOW: Weather[] = ['BLIZZARD', 'SNOWLIGHT', 'SNOW'];

@Provider()
export class SnowProvider {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject('Store')
    private store: Store;

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

    @StateSelector(state => state.global.weather, state => state.global.snow)
    async onWeatherChange(weather: Weather, snow: boolean) {
        await this.applySnowForWeather(weather, snow);
    }
}

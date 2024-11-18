import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { RpcServerEvent } from '../../shared/rpc';
import { ForecastWithTemperature } from '../../shared/weather';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class HudWeatherIconProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private forecasts: ForecastWithTemperature[] = [];

    private actives: string[] = [];
    private current: string;
    private nuiReady = false;

    private update() {
        if (this.nuiReady && this.current != this.actives[0]) {
            this.current = this.actives[0];
            this.nuiDispatch.dispatch('weather', 'icon', this.current);
        }
    }

    public add(icon: string): void {
        if (this.actives.indexOf(icon) == -1) {
            this.actives.push(icon);
        }
        this.update();
    }

    public remove(icon: string): void {
        const index = this.actives.indexOf(icon);
        if (index > -1) {
            this.actives.splice(index, 1);
        }
        this.update();
    }

    @Once(OnceStep.NuiLoaded)
    public async nuiloaded() {
        this.nuiReady = true;
        this.update();

        this.forecasts = await emitRpc<ForecastWithTemperature[]>(RpcServerEvent.WEATHER_GET_FORECASTS);

        if (this.forecasts.length > 0) {
            this.nuiDispatch.dispatch('weather', 'forecast', this.forecasts.shift());
        }
    }

    public getCurrent() {
        return this.current;
    }

    @OnEvent(ClientEvent.WEATHER_UPDATE_FORECASTS)
    public onWeatherUpdateForecasts(forecast: ForecastWithTemperature[]) {
        this.forecasts = forecast;
        this.nuiDispatch.dispatch('weather', 'forecast', this.forecasts?.shift());
    }
}

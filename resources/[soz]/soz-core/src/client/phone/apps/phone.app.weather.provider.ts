import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { OnNuiEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { NuiEvent } from '../../../shared/event/nui';
import { RpcServerEvent } from '../../../shared/rpc';
import { ForecastWithTemperature } from '../../../shared/weather';
import { NuiDispatch } from '../../nui/nui.dispatch';

@Provider()
export class PhoneAppWeatherProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @OnNuiEvent(NuiEvent.PhoneAppWeatherFetchData)
    async fetchData() {
        const weather = await emitRpc<ForecastWithTemperature[]>(RpcServerEvent.GET_FORECASTS);
        this.nuiDispatch.dispatch('phone', 'AppWeatherSetData', weather);

        const storm = await emitRpc<number>(RpcServerEvent.GET_STORM_ALERT);
        this.nuiDispatch.dispatch('phone', 'AppWeatherSetStormAlert', storm);
    }
}

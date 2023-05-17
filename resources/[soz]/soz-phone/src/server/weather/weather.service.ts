import { WeatherForecast } from '../../../typings/app/weather';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { weatherLogger } from './weather.utils';

class _WeatherService {
    async handleFetchForecasts(reqObj: PromiseRequest<void>, resp: PromiseEventResp<WeatherForecast[]>) {
        try {
            const forecasts = exports['soz-core'].getWeatherForecasts();
            resp({ status: 'ok', data: forecasts });
        } catch (e) {
            weatherLogger.error(`Error in handleFetchForecasts, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async handleFetchStormAlert(reqObj: PromiseRequest<void>, resp: PromiseEventResp<number>) {
        try {
            const alert = exports['soz-core'].getStormAlert();
            resp({ status: 'ok', data: alert });
        } catch (e) {
            weatherLogger.error(`Error in handleFetchStormAlert, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const WeatherService = new _WeatherService();
export default WeatherService;

import { WeatherEvents, WeatherForecast } from '../../../typings/app/weather';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import WeatherService from './weather.service';
import { weatherLogger } from './weather.utils';

onNetPromise<void, WeatherForecast[]>(WeatherEvents.FETCH_FORECASTS, (reqObj, resp) => {
    WeatherService.handleFetchForecasts(reqObj, resp).catch(e => {
        weatherLogger.error(`Error occurred in fetch forecast event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<void, number>(WeatherEvents.FETCH_STORM_ALERT, (reqObj, resp) => {
    WeatherService.handleFetchStormAlert(reqObj, resp).catch(e => {
        weatherLogger.error(`Error occurred in fetch storm alert event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

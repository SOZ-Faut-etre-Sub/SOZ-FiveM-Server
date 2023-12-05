import { WeatherEvents, WeatherForecast } from '../../../typings/app/weather';
import { sendWeatherEvent } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(WeatherEvents.FETCH_FORECASTS);
RegisterNuiProxy(WeatherEvents.FETCH_STORM_ALERT);

onNet(WeatherEvents.UPDATE_FORECASTS, (result: WeatherForecast[]) => {
    sendWeatherEvent(WeatherEvents.UPDATE_FORECASTS, result);
});

onNet(WeatherEvents.UPDATE_STORM_ALERT, (result: number) => {
    sendWeatherEvent(WeatherEvents.UPDATE_STORM_ALERT, result);
});

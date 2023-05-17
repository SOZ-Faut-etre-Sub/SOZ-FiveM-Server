import { useEffect } from 'react';

import { store } from '../../store';
import { useNuiEvent } from '../../../libs/nui/hooks/useNuiEvent';
import { WeatherEvents } from '../../../../typings/app/weather';

export const useAppWeatherService = () => {
    useEffect(() => {
        console.log('Refresh the forecasts');
        store.dispatch.appWeather.refreshForecasts();
        store.dispatch.appWeather.refreshStormAlert();
    }, []);

    useNuiEvent('WEATHER', WeatherEvents.UPDATE_FORECASTS, store.dispatch.appWeather.refreshForecasts);
    useNuiEvent('WEATHER', WeatherEvents.UPDATE_STORM_ALERT, store.dispatch.appWeather.refreshStormAlert);
};
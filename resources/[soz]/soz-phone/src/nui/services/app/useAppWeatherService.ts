import { useEffect } from 'react';

import { WeatherEvents } from '../../../../typings/app/weather';
import { useNuiEvent } from '../../../libs/nui/hooks/useNuiEvent';
import { store } from '../../store';

export const useAppWeatherService = () => {
    useEffect(() => {
        store.dispatch.appWeather.refreshForecasts();
        store.dispatch.appWeather.refreshStormAlert();
    }, []);

    useNuiEvent('WEATHER', WeatherEvents.UPDATE_FORECASTS, store.dispatch.appWeather.refreshForecasts);
    useNuiEvent('WEATHER', WeatherEvents.UPDATE_STORM_ALERT, store.dispatch.appWeather.refreshStormAlert);
};

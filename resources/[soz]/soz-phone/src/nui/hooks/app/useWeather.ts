import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useCallback } from 'react';

export const useWeather = () => {
    const forecasts = useSelector((state: RootState) => state.appWeather.forecasts);
    const stormAlert: Date = useSelector((state: RootState) => state.appWeather.alert);

    const getForecasts = useCallback(() => {
        return forecasts;
    }, [forecasts]);

    const getAlert = useCallback(() => {
        return stormAlert;
    }, [stormAlert]);

    return {
        getForecasts,
        getAlert,
    };
};
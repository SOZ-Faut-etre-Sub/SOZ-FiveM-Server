import { useAtomValue } from 'jotai';

import { currentForecastAtom, forecastsAtom } from '../weather.atom';

export const useWeatherForecast = () => {
    const forecasts = useAtomValue(forecastsAtom);
    const currentForecast = useAtomValue(currentForecastAtom);

    return {
        forecasts,
        currentForecast,
    };
};

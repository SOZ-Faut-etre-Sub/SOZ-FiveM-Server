import { RootState } from '@public/nui/store';
import { useSelector } from 'react-redux';

import { usePhoneTimeIsDay } from '../../../system/phone.atom';

export const useWeather = () => {
    const isDay = usePhoneTimeIsDay();
    const isSummer = useSelector((state: RootState) => state.features.SummerHeat);

    const fixWeatherName = (weather: string): string => {
        if (weather.toUpperCase() == 'EXTRASUNNY') {
            weather = `EXTRASUNNY.${isDay ? 'DAY' : 'NIGHT'}`;
        } else if (isSummer && weather.toUpperCase() == 'BLIZZARD') {
            weather = `SANDSTORM`;
        } else {
            weather = weather.toUpperCase();
        }
        return weather;
    };

    return {
        fixWeatherName,
    };
};

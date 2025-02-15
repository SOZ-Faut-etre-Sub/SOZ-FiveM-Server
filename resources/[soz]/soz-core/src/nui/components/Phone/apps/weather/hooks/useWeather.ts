import { usePhoneTimeIsDay } from '../../../system/phone.atom';

export const useWeather = () => {
    const isDay = usePhoneTimeIsDay();

    const fixWeatherName = (weather: string): string => {
        if (weather.toUpperCase() == 'EXTRASUNNY') {
            weather = `EXTRASUNNY.${isDay ? 'DAY' : 'NIGHT'}`;
        } else {
            weather = weather.toUpperCase();
        }
        return weather;
    };

    return {
        fixWeatherName,
    };
};

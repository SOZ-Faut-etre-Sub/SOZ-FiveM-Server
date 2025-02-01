import { useNuiEvent } from '@public/nui/hook/nui';
import { atom } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { atomWithRefresh } from 'jotai/utils';

import { ForecastWithTemperature } from '../../../../../shared/weather';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

export const alertEndTimestampAtom = atom<number>();
export const alertInProgressAtom = atomWithRefresh<boolean>(get => get(alertEndTimestampAtom) > Date.now());

export const forecastsAtom = atom<ForecastWithTemperature[]>([]);
export const currentForecastAtom = atom<ForecastWithTemperature | undefined>(get => get(forecastsAtom)[0]);

export const useAppWeatherStateHandlers = () => {
    const setAlertEndTimestamp = useSetAtom(alertEndTimestampAtom);
    const setForecasts = useSetAtom(forecastsAtom);

    useNuiEvent('phone', 'AppWeatherSetData', setForecasts);
    useNuiEvent('phone', 'AppWeatherSetStormAlert', setAlertEndTimestamp);

    useInjectDebugData(() => {
        setAlertEndTimestamp(Date.now() + 10000);

        setForecasts([
            {
                temperature: 20,
                weather: 'HALLOWEEN',
                duration: 43200000, // 43200000 for 12 hours
            },
            {
                temperature: 45,
                weather: 'EXTRASUNNY',
                duration: 0,
            },
            {
                temperature: -5,
                weather: 'CLOUDS',
                duration: 0,
            },
            {
                temperature: 22,
                weather: 'SMOG',
                duration: 0,
            },
            {
                temperature: 0,
                weather: 'OVERCAST',
                duration: 0,
            },
        ]);
    });
};

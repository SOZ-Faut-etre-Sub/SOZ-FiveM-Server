import { useInterval } from '@public/nui/hook/useInterval';
import { NuiEvent } from '@public/shared/event/nui';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchNui } from '../../../../fetch';
import { AppContainer } from '../../components/system/AppContainer';
import { AppContent } from '../../components/system/AppContent';
import { AppWrapper } from '../../components/system/AppWrapper';
import { usePhoneTimeIsDay } from '../../system/phone.atom';
import { WeatherIcon } from './components/WeatherIcon';
import { useWeatherAlert } from './hooks/useWeatherAlert';
import { useWeatherForecast } from './hooks/useWeatherForecast';
import { Forecasts } from './pages/Forecasts';

export const WeatherApp: FunctionComponent = () => {
    const { t } = useTranslation();

    const isDay = usePhoneTimeIsDay();
    const { alertInProgress, alertEndTime, refreshAlertInProgress } = useWeatherAlert();
    const { currentForecast } = useWeatherForecast();

    const [, forceRender] = useState<number>(0);

    useInterval(() => {
        if (!alertInProgress) return;

        refreshAlertInProgress();
        forceRender(prev => prev + 1);
    }, 5000);

    useEffect(() => {
        fetchNui(NuiEvent.PhoneAppWeatherFetchData);
    }, []);

    return (
        <AppContainer disableBackground>
            <div
                className={clsx('absolute inset-0 bg-gradient-to-t -z-10', {
                    'from-red-900 to-red-600': alertInProgress,
                    'from-sky-900 to-sky-400': !alertInProgress && isDay,
                    'from-sky-900 to-indigo-900': !alertInProgress && !isDay,
                    'from-sky-900 to-orange-500': !alertInProgress,
                })}
            />
            <AppWrapper>
                {alertInProgress ? (
                    <AppContent className="flex flex-col justify-center items-center gap-7 h-full text-center text-white font-thin">
                        <WeatherIcon icon={currentForecast?.weather} size="200px" className="w-4/5" />
                        <h1 className="text-5xl uppercase">{t('WEATHER.ALERT.TITLE')}</h1>
                        <h2 className="text-2xl">{t('WEATHER.ALERT.DESCRIPTION')}</h2>
                        <h1 className="text-4xl">
                            {formatDistanceToNow(alertEndTime, { includeSeconds: true, locale: fr })}
                        </h1>
                    </AppContent>
                ) : (
                    <Forecasts />
                )}
            </AppWrapper>
        </AppContainer>
    );
};

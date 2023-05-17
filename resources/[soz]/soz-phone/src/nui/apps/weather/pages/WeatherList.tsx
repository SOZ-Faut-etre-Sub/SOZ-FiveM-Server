import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useWeather } from '../../../hooks/app/useWeather';
import { useTime } from '../../../hooks/usePhone';
import { AppContent } from '../../../ui/components/AppContent';
import {
    BlizzardIcon,
    ClearingIcon,
    ClearingNightIcon,
    CloudsIcon,
    HalloweenIcon,
    NeutralIcon,
    NeutralNightIcon,
    RainIcon,
    SmogDayIcon,
    SmogNightIcon,
    SnowIcon,
    SnowLightIcon,
    SunnyDayIcon,
    SunnyNightIcon,
    ThunderIcon,
    XmasIcon,
} from '../assets/icons';
import { advanceTime, extractTime, isDay } from '../utils/time';

export const WeatherList = memo(() => {
    const [t] = useTranslation();
    const { getForecasts, getAlert } = useWeather();
    const time = useTime();
    const forecasts = getForecasts();
    const alertDate: Date = getAlert();
    const [alertMessage, setAlertMessage] = useState<string>();
    const checkAlert = () => {
        if (alertDate && alertDate.getTime() > Date.now()) {
            const remainingTime = alertDate.getTime() - Date.now();
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)).toString(10);
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000).toString(10);
            setAlertMessage(`${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`);
        } else {
            setAlertMessage('');
        }
    };

    useEffect(() => {
        checkAlert();
        const interval = setInterval(checkAlert, 1000);

        return () => clearInterval(interval);
    }, [alertDate]);

    const getIcon = (icon: string, size: string, isDay: boolean, className?: string) => {
        switch (icon) {
            case 'EXTRASUNNY':
            case 'CLEAR': {
                if (isDay) {
                    return <SunnyDayIcon className={className || ''} width={size} height={size} />;
                }
                return <SunnyNightIcon className={className || ''} width={size} height={size} />;
            }
            case 'CLOUDS':
            case 'OVERCAST': {
                return <CloudsIcon className={className || ''} width={size} height={size} />;
            }
            case 'SMOG':
            case 'FOGGY': {
                if (isDay) {
                    return <SmogDayIcon className={className || ''} width={size} height={size} />;
                }
                return <SmogNightIcon className={className || ''} width={size} height={size} />;
            }
            case 'RAIN': {
                return <RainIcon className={className || ''} width={size} height={size} />;
            }
            case 'THUNDER': {
                return <ThunderIcon className={className || ''} width={size} height={size} />;
            }
            case 'CLEARING': {
                if (isDay) {
                    return <ClearingIcon className={className || ''} width={size} height={size} />;
                }
                return <ClearingNightIcon className={className || ''} width={size} height={size} />;
            }
            case 'NEUTRAL': {
                if (isDay) {
                    return <NeutralIcon className={className || ''} width={size} height={size} />;
                }
                return <NeutralNightIcon className={className || ''} width={size} height={size} />;
            }
            case 'SNOW': {
                return <SnowIcon className={className || ''} width={size} height={size} />;
            }
            case 'BLIZZARD': {
                return <BlizzardIcon className={className || ''} width={size} height={size} />;
            }
            case 'SNOWLIGHT': {
                return <SnowLightIcon className={className || ''} width={size} height={size} />;
            }
            case 'XMAS': {
                return <XmasIcon className={className || ''} width={size} height={size} />;
            }
            case 'HALLOWEEN': {
                return <HalloweenIcon className={className || ''} width={size} height={size} />;
            }
        }
    };

    if (alertMessage) {
        return (
            <AppContent>
                <div className="m-auto pt-1 pb-3 flex flex-col w-11/12 h-full justify-between text-white font-thin">
                    <div className="mt-20 text-center">
                        {getIcon(forecasts[0].weather, '150px', isDay(extractTime(time)), 'm-auto')}
                        <h1 className="text-5xl">{t('WEATHER.ALERT.TITLE')}</h1>
                        <h2 className="my-5 text-2xl">{t('WEATHER.ALERT.DESCRIPTION')}</h2>
                        <h1 className="text-4xl">{alertMessage}</h1>
                    </div>
                </div>
            </AppContent>
        );
    }

    if (forecasts && forecasts.length) {
        const timeObject = extractTime(time);
        let day = isDay(timeObject) ? 'DAY' : 'NIGHT';
        const currentWeatherForecastKey =
            'WEATHER.FORECASTS.' +
            (forecasts[0].weather.toUpperCase() === 'EXTRASUNNY'
                ? 'EXTRASUNNY.' + day
                : forecasts[0].weather.toUpperCase());
        advanceTime(timeObject, forecasts[0].duration);

        return (
            <AppContent>
                <div className="m-auto pt-1 pb-3 flex flex-col w-11/12 h-full justify-between text-white font-thin">
                    <div className="mt-40 m-auto text-center">
                        {getIcon(forecasts[0].weather, '100px', day === 'DAY', 'm-auto')}
                        <h1 className="text-3xl">{t(currentWeatherForecastKey)}</h1>
                        <h1 className="flex-auto text-5xl">{forecasts[0].temperature}°C</h1>
                    </div>
                    <div>
                        <p className="mb-2">Prévisions</p>
                        <ul className="p-2 bg-opacity-10 bg-black rounded">
                            {forecasts.slice(1).map((forecast, index) => {
                                day = isDay(timeObject) ? 'DAY' : 'NIGHT';
                                const weatherForecastKey =
                                    'WEATHER.FORECASTS.' +
                                    (forecast.weather.toUpperCase() === 'EXTRASUNNY'
                                        ? 'EXTRASUNNY.' + day
                                        : forecast.weather.toUpperCase());
                                advanceTime(timeObject, forecast.duration);
                                console.log(forecast.weather, day);
                                return (
                                    <li
                                        className="py-1 flex flex-row justify-between h-10 leading-7"
                                        key={'forecast-' + index}
                                    >
                                        <div className="flex">
                                            {getIcon(forecast.weather, '2em', day === 'DAY')}
                                            <span className="ml-2 align-middle">{t(weatherForecastKey)}</span>
                                        </div>
                                        <div>
                                            <span className="mr-2">{forecast.temperature}°C</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </AppContent>
        );
    }

    return (
        <AppContent>
            <div className="m-auto pt-1 pb-3 flex flex-col w-5/6">
                <h2 className="m-auto text-center">{t('WEATHER.LOADING')}</h2>
            </div>
        </AppContent>
    );
});

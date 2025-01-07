import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { AppContent } from '../../../components/system/AppContent';
import { useThemeConfig } from '../../../system/config/config.atom';
import { WeatherIcon } from '../components/WeatherIcon';
import { useWeather } from '../hooks/useWeather';
import { useWeatherForecast } from '../hooks/useWeatherForecast';

export const Forecasts = () => {
    const { t } = useTranslation();
    const theme = useThemeConfig();

    const { forecasts } = useWeatherForecast();
    const { fixWeatherName } = useWeather();

    if (!forecasts || forecasts.length === 0) {
        return (
            <AppContent
                className={clsx('flex flex-col justify-center items-center h-full', {
                    'text-white': theme === 'dark',
                    'text-dark': theme === 'light',
                })}
            >
                <h2>{t('WEATHER.LOADING')}</h2>
            </AppContent>
        );
    }

    return (
        <AppContent>
            <div className="m-auto pt-1 pb-3 flex flex-col w-11/12 h-full justify-between text-white font-thin">
                <div className="mt-40 m-auto text-center">
                    <WeatherIcon icon={forecasts[0].weather} size="100px" className="m-auto" />
                    <h1 className="text-3xl">{t(`WEATHER.FORECASTS.${fixWeatherName(forecasts[0].weather)}`)}</h1>
                    <h1 className="flex-auto text-5xl">{forecasts[0].temperature}°C</h1>
                </div>

                <div>
                    <p className="mb-2">Prévisions</p>
                    <ul className="p-2 bg-opacity-10 bg-black rounded">
                        {forecasts.slice(1).map((forecast, index) => {
                            return (
                                <li
                                    className="py-1 flex flex-row justify-between h-10 leading-7"
                                    key={'forecast-' + index}
                                >
                                    <div className="flex">
                                        <WeatherIcon icon={forecast.weather} size="2em" />
                                        <span className="ml-2 align-middle">
                                            {t(`WEATHER.FORECASTS.${fixWeatherName(forecast.weather)}`)}
                                        </span>
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
};

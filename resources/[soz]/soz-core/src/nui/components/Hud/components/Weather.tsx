import cn from 'classnames';
import { FunctionComponent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { ForecastWithTemperature } from '../../../../shared/weather';
import { useDateTime } from '../../../hook/data';
import { useNuiEvent } from '../../../hook/nui';
import { RootState } from '../../../store';

export const Weather: FunctionComponent = () => {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const showWeather = useSelector((state: RootState) => state.hud.settings.showWeather);
    const { isDay } = useDateTime();

    const [forecast, setForecast] = useState<ForecastWithTemperature>();
    useNuiEvent('weather', 'forecast', setForecast);

    const [icon, setIcon] = useState<string>(null);
    useNuiEvent('weather', 'icon', setIcon);

    const weather = useMemo(() => {
        if (icon) return icon;

        const variant = isDay ? 'day' : 'night';

        switch (forecast?.weather) {
            case 'EXTRASUNNY':
            case 'CLEAR':
                return `${variant}/sun`;
            case 'CLOUDS':
            case 'SMOG':
            case 'OVERCAST':
            case 'CLEARING':
                return `${variant}/partial_cloud`;
            case 'FOGGY':
            case 'BLIZZARD':
                return `${variant}/cloud`;
            case 'RAIN':
                return `${variant}/rain`;
            case 'THUNDER':
            case 'NEUTRAL':
                return `${variant}/thunder`;
            case 'SNOW':
            case 'SNOWLIGHT':
            case 'XMAS':
                return `${variant}/snow`;
            case 'HALLOWEEN':
                return `${variant}/storm`;
            default:
                return `${variant}/cloudy`;
        }
    }, [forecast, icon, isDay]);

    if (!hasWatch || !forecast || !showWeather) {
        return null;
    }

    return (
        <div className="flex pb-1.5">
            <div
                className={cn('leading-3 mt-1.5', {
                    'relative left-3': weather.endsWith('sun'),
                })}
            >
                <span className="font-semibold">{forecast?.temperature}</span>
                <span className="font-light">°C</span>
            </div>
            <img className="h-14" src={`/public/images/hud/weather/${weather}.webp`} />
        </div>
    );
};

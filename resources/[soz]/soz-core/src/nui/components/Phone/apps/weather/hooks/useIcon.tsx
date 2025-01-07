import { FunctionComponent } from 'react';

import { usePhoneTimeIsDay } from '../../../system/phone.atom';
import {
    BlizzardIcon,
    ClearingIcon,
    ClearingNightIcon,
    CloudsIcon,
    HalloweenIcon,
    IconProps,
    NeutralIcon,
    NeutralNightIcon,
    RainIcon,
    SandStormIcon,
    SmogDayIcon,
    SmogNightIcon,
    SnowIcon,
    SnowLightIcon,
    SunnyDayIcon,
    SunnyNightIcon,
    ThunderIcon,
    XmasIcon,
} from '../assets/icons';
import { useWeather } from './useWeather';

export const useIcon = (icon: string): FunctionComponent<IconProps> => {
    const isDay = usePhoneTimeIsDay();
    const { fixWeatherName } = useWeather();

    switch (fixWeatherName(icon)) {
        case 'EXTRASUNNY.DAY':
            return SunnyDayIcon;
        case 'EXTRASUNNY.NIGHT':
            return SunnyNightIcon;
        case 'EXTRASUNNY':
        case 'CLEAR':
            return isDay ? SunnyDayIcon : SunnyNightIcon;
        case 'CLOUDS':
        case 'OVERCAST':
            return CloudsIcon;
        case 'SMOG':
        case 'FOGGY':
            return isDay ? SmogDayIcon : SmogNightIcon;
        case 'RAIN':
            return RainIcon;
        case 'THUNDER':
            return ThunderIcon;
        case 'CLEARING':
            return isDay ? ClearingIcon : ClearingNightIcon;
        case 'NEUTRAL':
            return isDay ? NeutralIcon : NeutralNightIcon;
        case 'SNOW':
            return SnowIcon;
        case 'BLIZZARD':
            return BlizzardIcon;
        case 'SNOWLIGHT':
            return SnowLightIcon;
        case 'XMAS':
            return XmasIcon;
        case 'HALLOWEEN':
            return HalloweenIcon;
        case 'SANDSTORM':
            return SandStormIcon;
    }
};

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { HudTheme } from '../../../../shared/hud';
import { useHudTheme } from '../../../hook/data';
import { RootState } from '../../../store';

export const useDaltonism = () => {
    const currentTheme = useHudTheme();

    const isHalloween = useSelector((state: RootState) => state.features.Halloween);
    const halloweenMoon = useSelector((state: RootState) => state.hud.halloween.moon);

    const daltonism = currentTheme === HudTheme.Daltonism;

    const glassmorphismColors: Record<
        Exclude<HudTheme, HudTheme.Auto>,
        { background: string; border: string }
    > = useMemo(() => {
        if (isHalloween) {
            const background = '#00000073';
            const border = '#F0882D';

            return {
                [HudTheme.Light]: { background, border },
                [HudTheme.Dark]: { background, border },
                [HudTheme.Green]: { background, border },
                [HudTheme.Uwu]: { background, border },
                [HudTheme.Daltonism]: { background, border },
                [HudTheme.HalloweenVein]: { background, border },
            };
        }

        return {
            [HudTheme.Light]: {
                background: '#F3FBFA4D',
                border: '#FFFFFF',
            },
            [HudTheme.Dark]: {
                background: '#22232A73',
                border: '#FFFFFF',
            },
            [HudTheme.Green]: {
                background: '#3F7B344D',
                border: '#00E949',
            },
            [HudTheme.Uwu]: {
                background: '#E3A7EC4D',
                border: '#E3A7EC',
            },
            [HudTheme.Daltonism]: {
                background: '#00000073',
                border: '#FFFFFF',
            },
            [HudTheme.HalloweenVein]: {
                background: '#00000073',
                border: '#F02B2B',
            },
        };
    }, [isHalloween, halloweenMoon]);

    return {
        glassmorphismColors,
        gaugeColors: {
            green_light: daltonism ? '#FFFFFF' : '#329121',
            green_dark: daltonism ? '#000000' : '#283525',
            blue_light: daltonism ? '#B314E8' : '#00A5E7',
            blue_dark: daltonism ? '#000000' : '#263136',
            red_light: daltonism ? '#00FFFF' : '#92212B',
            red_dark: daltonism ? '#000000' : '#362628',
            orange_light: daltonism ? '#FFFF00' : '#FCAF40',
            orange_dark: daltonism ? '#000000' : '#362F26',
        },
        targetColors: {
            citizen: daltonism ? '#FFFFFF' : '#FFFFFF',
            society: daltonism ? '#B314E8' : '#0984E3',
            criminal: daltonism ? '#FFFF00' : '#EF4444',
        },
        imagePrefix: daltonism ? 'daltonism/' : '',
    };
};

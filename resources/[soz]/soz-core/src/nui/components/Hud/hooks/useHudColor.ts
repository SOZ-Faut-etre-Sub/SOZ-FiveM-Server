import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { HudTheme } from '../../../../shared/hud';
import { useHudTheme } from '../../../hook/data';
import { RootState } from '../../../store';

interface GlassmorphismColors {
    glassmorphismColors: { background: string; border: string };
    gaugeColors: Record<string, string>;
    targetColors: Record<string, string>;
    color: string;
    card: string;
    button: { primary: { background: string; color: string }; secondary: { background: string; color: string } };
    imagePrefix: string;
}

export const useHudColor = (): GlassmorphismColors => {
    const currentTheme = useHudTheme();

    const isHalloween = useSelector((state: RootState) => state.features.Halloween);
    const halloweenMoon = useSelector((state: RootState) => state.hud.halloween.moon);

    const daltonism = currentTheme === HudTheme.Daltonism;

    const _glassmorphismColors: Record<
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

    const _colors = useMemo(
        () => ({
            [HudTheme.Light]: '#22232A',
            [HudTheme.Dark]: '#F3FBFA',
            [HudTheme.Green]: '#F3FBFA',
            [HudTheme.Uwu]: '#F3FBFA',
            [HudTheme.Daltonism]: '#F3FBFA',
            [HudTheme.HalloweenVein]: '#F3FBFA',
        }),
        []
    );

    const _buttons = useMemo(
        () => ({
            [HudTheme.Light]: {
                primary: {
                    background: '#22232A',
                    color: '#F3FBFA',
                },
                secondary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
            },
            [HudTheme.Dark]: {
                primary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
                secondary: {
                    background: '#454754',
                    color: '#F3FBFA',
                },
            },
            [HudTheme.Green]: {
                primary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
                secondary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
            },
            [HudTheme.Uwu]: {
                primary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
                secondary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
            },
            [HudTheme.Daltonism]: {
                primary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
                secondary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
            },
            [HudTheme.HalloweenVein]: {
                primary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
                secondary: {
                    background: '#F3FBFA',
                    color: '#22232A',
                },
            },
        }),
        []
    );

    const _cards = useMemo(
        () => ({
            [HudTheme.Light]: '#F3FBFA4D',
            [HudTheme.Dark]: '#3D405C4D',
            [HudTheme.Green]: '#3F7B344D',
            [HudTheme.Uwu]: '#E3A7EC4D',
            [HudTheme.Daltonism]: '#4547544D',
            [HudTheme.HalloweenVein]: '#4547544D',
        }),
        []
    );

    return {
        glassmorphismColors: _glassmorphismColors[currentTheme],
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
        color: _colors[currentTheme],
        button: _buttons[currentTheme],
        card: _cards[currentTheme],
        imagePrefix: daltonism ? 'daltonism/' : '',
    };
};

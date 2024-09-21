import { HudTheme } from '../../../../shared/hud';
import { useHudTheme } from '../../../hook/data';

export const useDaltonism = () => {
    const currentTheme = useHudTheme();

    const daltonism = currentTheme === HudTheme.Daltonism;

    return {
        glassmorphism_colors: {
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
        },
        gauge_colors: {
            green_light: daltonism ? '#FFFFFF' : '#329121',
            green_dark: daltonism ? '#000000' : '#283525',
            blue_light: daltonism ? '#B314E8' : '#00A5E7',
            blue_dark: daltonism ? '#000000' : '#263136',
            red_light: daltonism ? '#00FFFF' : '#92212B',
            red_dark: daltonism ? '#000000' : '#362628',
            orange_light: daltonism ? '#FFFF00' : '#FCAF40',
            orange_dark: daltonism ? '#000000' : '#362F26',
        },
        imagePrefix: daltonism ? 'daltonism/' : '',
    };
};

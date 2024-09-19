import { useSelector } from 'react-redux';

import { RootState } from '../../../store';

export const useDaltonism = () => {
    const daltonism = useSelector((state: RootState) => state.hud.settings.daltonism);

    return {
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

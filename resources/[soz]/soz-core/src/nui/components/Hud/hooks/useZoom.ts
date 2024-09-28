import { useSelector } from 'react-redux';

import { RootState } from '../../../store';

interface ZoomHook {
    height: string;
    width: string;
    iconSize: string;
    smallIconSize: string;
    largeIconSize: string;
    speedometerSize: string;
    nosPaddingTopSize: string;
    nosPaddingLeftSize: string;
}

export const useZoom = (): ZoomHook => {
    const zoom = useSelector((state: RootState) => state.hud.settings.zoom);

    return {
        width: 48 * zoom + 'px',
        height: 48 * zoom + 'px',
        iconSize: 32 * zoom + 'px',
        smallIconSize: 20 * zoom + 'px',
        largeIconSize: 56 * zoom + 'px',
        speedometerSize: 125 * zoom + 'px',
        nosPaddingTopSize: 20 * zoom + 'px',
        nosPaddingLeftSize: 40 * zoom + 'px',
    };
};

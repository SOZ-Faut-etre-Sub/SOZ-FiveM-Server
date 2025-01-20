import '../Phone.scss';

import { fetchNui } from '@public/nui/fetch';
import { animated, useSpring } from '@react-spring/web';
import React, { FunctionComponent, memo, PropsWithChildren, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { NuiEvent } from '../../../../shared/event/nui';
import { useAssetPath } from '../../../hook/assets';
import { useMinimap } from '../../../hook/data';
import {
    useFrameConfig,
    useHandsFreeConfig,
    usePlaneMode,
    useWallpaperConfig,
    useZoomConfig,
} from './config/config.atom';
import { isDefaultWallpaper } from './config/utils/wallpaper';
import {
    usePhoneAvailable,
    usePhoneNotificationVisibility,
    usePhoneVisibility,
    useSetPhoneFreeCamera,
} from './phone.atom';
import { PHONE_HEIGHT, PHONE_WIDTH } from './phone.constant';
import { useCall } from './sim-card/hooks/useCall';

export const PhoneWrapper: FunctionComponent<PropsWithChildren> = memo(({ children }) => {
    const { pathname } = useLocation();
    const minimap = useMinimap();

    const available = usePhoneAvailable();
    const visibility = usePhoneVisibility();
    const notifVisibility = usePhoneNotificationVisibility();
    const setFreeCamera = useSetPhoneFreeCamera();

    const { currentCall } = useCall();

    const zoom = useZoomConfig();
    const handsFree = useHandsFreeConfig();
    const planeMode = usePlaneMode();

    const bottomCalc = () => {
        if (!available) {
            return '-100vh';
        }

        if (handsFree && !planeMode && !visibility && !!currentCall) {
            return `${60 - minimap.bottom * 100}vh`;
        }

        if (handsFree && !planeMode && !visibility && notifVisibility) {
            return `${80 - minimap.bottom * 100}vh`;
        }

        return visibility ? `${100 - minimap.bottom * 100}vh` : '-100vh';
    };

    const handlePhoneClick = () => {
        if (!pathname.includes('/camera')) return;

        setFreeCamera(v => !v);
    };

    const styles = useSpring({
        from: {
            bottom: '-100vh',
        },
        to: {
            bottom: bottomCalc(),
            right: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    return (
        <animated.div onClick={handlePhoneClick} className="font-sfpro relative h-screen w-screen">
            <animated.div
                className="absolute bg-cover origin-bottom-right"
                style={{
                    ...styles,
                    width: PHONE_WIDTH,
                    height: PHONE_HEIGHT,
                    zoom: `${zoom}%`,
                }}
            >
                <PhoneFrame />
                <PhoneScreen>{children}</PhoneScreen>
            </animated.div>
        </animated.div>
    );
});

const PhoneFrame = memo(() => {
    const { getPath } = useAssetPath();
    const frame = useFrameConfig();

    return (
        <div
            className="absolute z-[100] pointer-events-none"
            style={{
                width: PHONE_WIDTH,
                height: PHONE_HEIGHT,
                backgroundImage: `url(${getPath(`images/phone/frames/${frame}`)}`,
            }}
        />
    );
});

const PhoneScreen = memo(({ children }: { children: ReactNode }) => {
    const { getPath } = useAssetPath();
    const wallpaper = useWallpaperConfig();

    return (
        <div
            className="overflow-hidden absolute inset-[24px] flex flex-col rounded-[40px] bg-phone-800 bg-cover bg-center"
            style={{
                backgroundImage: !isDefaultWallpaper(wallpaper)
                    ? `url(${wallpaper})`
                    : `url(${getPath(`images/phone/backgrounds/${wallpaper}`)}`,
            }}
        >
            {children}
        </div>
    );
});

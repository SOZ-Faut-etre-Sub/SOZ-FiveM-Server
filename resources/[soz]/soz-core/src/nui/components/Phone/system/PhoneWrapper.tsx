import '../Phone.scss';

import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import React, { FunctionComponent, memo, PropsWithChildren, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

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
import { useNotificationVisibility } from './notifications/hooks/useNotificationVisibility';
import { usePhoneAvailable, usePhoneVisibility, useSetPhoneFreeCamera } from './phone.atom';
import { PHONE_HEIGHT, PHONE_WIDTH } from './phone.constant';
import { useCall } from './sim-card/hooks/useCall';

export const PhoneWrapper: FunctionComponent<PropsWithChildren> = memo(({ children }) => {
    const { pathname } = useLocation();
    const minimap = useMinimap();

    const available = usePhoneAvailable();
    const visibility = usePhoneVisibility();
    const notifVisibility = useNotificationVisibility();
    const setFreeCamera = useSetPhoneFreeCamera();

    const { currentCall } = useCall();

    const zoom = useZoomConfig();
    const handsFree = useHandsFreeConfig();
    const planeMode = usePlaneMode();

    const bottomCalc = () => {
        if (!available) {
            return -1000;
        }

        if (handsFree && !planeMode && !visibility && (notifVisibility || !!currentCall)) {
            return -700;
        }

        return visibility ? 50 : -1000;
    };

    const handlePhoneClick = () => {
        if (!pathname.includes('/camera')) return;

        setFreeCamera(v => !v);
    };

    const styles = useSpring({
        from: {
            bottom: -1000,
        },
        to: {
            bottom: bottomCalc(),
            right: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    return (
        <animated.div
            onClick={handlePhoneClick}
            className={clsx('font-sfpro relative h-screen w-screen z-10', {
                'pointer-events-auto': pathname.includes('/camera'),
            })}
        >
            <animated.div
                className="absolute bg-cover origin-bottom-right pointer-events-auto"
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

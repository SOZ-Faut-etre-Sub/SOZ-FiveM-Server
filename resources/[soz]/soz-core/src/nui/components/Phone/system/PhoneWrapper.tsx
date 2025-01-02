import '../Phone.scss';

import { animated, useSpring } from '@react-spring/web';
import React, { FunctionComponent, memo, PropsWithChildren, ReactNode } from 'react';

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
import { usePhoneAvailable, usePhoneNotificationVisibility, usePhoneVisibility } from './phone.atom';
import { PHONE_HEIGHT, PHONE_WIDTH } from './phone.constant';
import { useCall } from './sim-card/hooks/useCall';

export const PhoneWrapper: FunctionComponent<PropsWithChildren> = memo(({ children }) => {
    const minimap = useMinimap();

    const available = usePhoneAvailable();
    const visibility = usePhoneVisibility();
    const notifVisibility = usePhoneNotificationVisibility();

    const { currentCall } = useCall();

    const zoom = useZoomConfig();
    const handsFree = useHandsFreeConfig();
    const planeMode = usePlaneMode();

    const bottomCalc = () => {
        if (!available) {
            return '-150vh';
        }

        if (handsFree && !planeMode && !visibility && !!currentCall) {
            return `${60 - minimap.bottom * 100}vh`;
        }

        if (handsFree && !planeMode && !visibility && notifVisibility) {
            return `${80 - minimap.bottom * 100}vh`;
        }

        return visibility ? `${100 - minimap.bottom * 100}vh` : '-150vh';
    };

    const styles = useSpring({
        from: {
            bottom: '-150vh',
        },
        to: {
            bottom: bottomCalc(),
            right: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    // const { pathname } = useLocation();

    return (
        <animated.div
            className="font-sfpro relative h-screen w-screen"
            // onClick={() => {
            //     if (pathname.includes('/camera')) {
            //         fetchNui<ServerPromiseResp<void>>(PhotoEvents.TOGGLE_CONTROL_CAMERA, {});
            //     }
            // }}
        >
            <animated.div
                className="absolute bg-cover origin-bottom-right transition-any ease-in-out duration-300"
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
            className="absolute z-50 pointer-events-none"
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

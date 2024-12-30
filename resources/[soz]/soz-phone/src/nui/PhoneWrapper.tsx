import { ServerPromiseResp } from '@typings/common';
import { PhotoEvents } from '@typings/photo';
import cn from 'classnames';
import React, { memo, PropsWithChildren, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { isDefaultWallpaper } from './apps/settings/utils/isDefaultWallpaper';
import { fetchNui } from './common/utils/fetchNui';
import { useConfig, useVisibility } from './hooks/usePhone';
import { useCall } from './os/call/hooks/useCall';
import { RootState } from './store';

const PHONE_WIDTH = 490;
const PHONE_HEIGHT = 1000;

const PhoneWrapper: React.FC<PropsWithChildren> = memo(({ children }) => {
    const available = useSelector((state: RootState) => state.phone.available);

    const settings = useConfig();
    const { pathname } = useLocation();

    const { call } = useCall();
    const { visibility, notifVisibility } = useVisibility();

    const wrapperClass = useMemo(() => {
        if (!available) {
            return 'translate-y-[1000px]';
        }

        if (settings.handsFree && !settings.planeMode && !visibility && !!call) {
            return 'translate-y-[650px]';
        }

        if (settings.handsFree && !settings.planeMode && !visibility && notifVisibility) {
            return 'translate-y-[800px]';
        }
        return visibility ? 'translate-y-0' : 'translate-y-[1000px]';
    }, [available, settings, call, visibility, notifVisibility]);

    const aspectRatio = window.innerWidth / window.innerHeight;
    const rightOffset = () => {
        if (aspectRatio > 3.5 && window.innerWidth > 5000) {
            return 'right-[106vh]';
        } else {
            return 'right-0';
        }
    };

    return (
        <div
            className="relative h-screen w-screen"
            onClick={() => {
                if (pathname.includes('/camera')) {
                    fetchNui<ServerPromiseResp<void>>(PhotoEvents.TOGGLE_CONTROL_CAMERA, {});
                }
            }}
        >
            <div
                className={cn(
                    `fixed bottom-[100px] right-[50px] bg-cover origin-bottom-right transition-any ease-in-out duration-300`,
                    wrapperClass,
                    rightOffset()
                )}
                style={{
                    width: PHONE_WIDTH,
                    height: PHONE_HEIGHT,
                    zoom: `${settings.zoom.value}%`,
                }}
            >
                <PhoneFrame />
                <PhoneScreen>{children}</PhoneScreen>
            </div>
        </div>
    );
});

export const PhoneFrame = memo(() => {
    const settings = useConfig();

    return (
        <div
            className="absolute z-50 pointer-events-none"
            style={{
                width: PHONE_WIDTH,
                height: PHONE_HEIGHT,
                backgroundImage: `url(media/frames/${settings.frame.value})`,
            }}
        />
    );
});

export const PhoneScreen = memo(({ children }: { children: React.ReactNode }) => {
    const settings = useConfig();

    return (
        <div
            className="overflow-hidden absolute inset-[24px] flex flex-col rounded-[40px] bg-cover bg-center"
            style={{
                backgroundColor: '#545454',
                backgroundImage: !isDefaultWallpaper(settings.wallpaper.value)
                    ? `url(${settings.wallpaper.value})`
                    : `url(media/backgrounds/${settings.wallpaper.value})`,
            }}
        >
            {children}
        </div>
    );
});

export default PhoneWrapper;

import { ServerPromiseResp } from '@typings/common';
import { PhotoEvents } from '@typings/photo';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
import React, { memo, PropsWithChildren, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { isDefaultWallpaper } from './apps/settings/utils/isDefaultWallpaper';
import { useConfig, useVisibility } from './hooks/usePhone';
import { useCall } from './os/call/hooks/useCall';
import { RootState } from './store';

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

        if (settings.handsFree && !visibility && !!call) {
            return 'translate-y-[650px]';
        }
        if (settings.handsFree && !visibility && notifVisibility) {
            return 'translate-y-[800px]';
        }
        return visibility ? 'translate-y-0' : 'translate-y-[1000px]';
    }, [available, settings, call, visibility, notifVisibility]);

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
                    'fixed right-0 bottom-0 w-[500px] h-[1000px] bg-cover origin-bottom-right transition-any ease-in-out duration-300',
                    wrapperClass
                )}
                style={{
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
    return (
        <div
            className="absolute z-50 w-[500px] h-[1000px] pointer-events-none"
            style={{
                backgroundImage: `url(media/frames/default.png)`,
            }}
        />
    );
});

export const PhoneScreen = memo(({ children }: { children: React.ReactNode }) => {
    const settings = useConfig();

    return (
        <div
            className="overflow-hidden absolute bottom-[100px] left-[50px] right-[50px] top-[35px] flex flex-col rounded-[40px] bg-cover bg-center"
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

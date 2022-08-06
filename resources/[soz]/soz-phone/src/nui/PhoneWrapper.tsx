import { ServerPromiseResp } from '@typings/common';
import { PhotoEvents } from '@typings/photo';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
import React, { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { useSettings } from './apps/settings/hooks/useSettings';
import { isDefaultWallpaper } from './apps/settings/utils/isDefaultWallpaper';
import { useVisibility } from './hooks/usePhone';

const PhoneWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    const [settings] = useSettings();
    const { pathname } = useLocation();
    const { visibility, notifVisibility } = useVisibility();

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
                    {
                        'translate-y-0': visibility,
                        'translate-y-[800px]': !visibility && notifVisibility,
                        'translate-y-[1000px]': !visibility,
                    }
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
};

export function PhoneFrame() {
    return (
        <div
            className="absolute z-50 w-[500px] h-[1000px] pointer-events-none"
            style={{
                backgroundImage: `url(media/frames/default.png)`,
            }}
        />
    );
}

export function PhoneScreen({ children }: { children: React.ReactNode }) {
    const [settings] = useSettings();

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
}

export default PhoneWrapper;

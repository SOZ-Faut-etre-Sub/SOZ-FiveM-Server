import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import { ServerPromiseResp } from '@typings/common';
import { PhotoEvents } from '@typings/photo';
import { fetchNui } from '@utils/fetchNui';
import cn from 'classnames';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useSettings } from './apps/settings/hooks/useSettings';
import { isDefaultWallpaper } from './apps/settings/utils/isDefaultWallpaper';

const PhoneWrapper: React.FC = ({ children }) => {
    const [settings] = useSettings();
    const { pathname } = useLocation();
    const { visibility, notifVisibility } = usePhoneVisibility();

    return (
        <div
            className={cn('transition-any ease-in-out duration-500', {
                'translate-y-0': visibility,
                'translate-y-[38rem]': !visibility && notifVisibility,
                'translate-y-[2000px]': !visibility && !notifVisibility,
            })}
        >
            <div
                className="PhoneWrapper"
                onClick={() => {
                    if (pathname === '/camera') {
                        fetchNui<ServerPromiseResp<void>>(PhotoEvents.TOGGLE_CONTROL_CAMERA, {});
                    }
                }}
            >
                <div
                    className="Phone"
                    style={{
                        position: 'fixed',
                        transformOrigin: 'right bottom',
                        zoom: `${settings.zoom.value}%`,
                        bottom: 0,
                    }}
                >
                    <div
                        className="PhoneFrame"
                        style={{
                            backgroundImage: `url(media/frames/default.png)`,
                        }}
                    />
                    <div
                        id="phone"
                        className={pathname === '/' ? 'PhoneScreen' : 'PhoneScreen PhoneScreenNoHome'}
                        style={{
                            backgroundColor: '#545454',
                            backgroundImage: !isDefaultWallpaper(settings.wallpaper.value)
                                ? `url(${settings.wallpaper.value})`
                                : `url(media/backgrounds/${settings.wallpaper.value})`,
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneWrapper;

import React, {useEffect, useRef} from 'react';
import {isDefaultWallpaper} from './apps/settings/utils/isDefaultWallpaper';
import {useSettings} from './apps/settings/hooks/useSettings';
import {usePhoneVisibility} from '@os/phone/hooks/usePhoneVisibility';
import {useRouteMatch} from "react-router-dom";
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {PhotoEvents} from "@typings/photo";

const PhoneWrapper: React.FC = ({children}) => {
    const appRef = useRef(null);
    const [settings] = useSettings();
    const {isExact} = useRouteMatch('/');
    const isCameraPath = useRouteMatch('/camera');
    const {visibility} = usePhoneVisibility();

    useEffect(() => {
        appRef.current.animate(
            visibility ? [{transform: 'translateY(100%)'}, {transform: 'translateY(0)'}] : [{transform: 'translateY(0)'}, {transform: 'translateY(100%)'}]
            , {duration: 500});
    }, [visibility]);

    return (
        <div ref={appRef} className="PhoneWrapper" style={{transform: visibility ? 'translateY(0)' : 'translateY(100%)'}} onClick={() => {
            if (isCameraPath && isCameraPath.isExact) {
                fetchNui<ServerPromiseResp<void>>(PhotoEvents.TOGGLE_CONTROL_CAMERA, {})
            }
        }}>
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
                    className={isExact ? "PhoneScreen" : "PhoneScreen PhoneScreenNoHome"}
                    style={{
                        backgroundImage: !isDefaultWallpaper(settings.wallpaper.value)
                            ? `url(${settings.wallpaper.value})`
                            : `url(media/backgrounds/${settings.wallpaper.value})`,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PhoneWrapper;

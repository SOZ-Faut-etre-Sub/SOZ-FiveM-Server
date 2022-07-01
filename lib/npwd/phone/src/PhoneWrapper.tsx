import React from 'react';
import { isDefaultWallpaper } from './apps/settings/utils/isDefaultWallpaper';
import { useSettings } from './apps/settings/hooks/useSettings';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import {useRouteMatch} from "react-router-dom";
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {PhotoEvents} from "@typings/photo";
import cn from "classnames";

const PhoneWrapper: React.FC = ({ children }) => {
  const [settings] = useSettings();
  const {isExact} = useRouteMatch('/');
  const isCameraPath = useRouteMatch('/camera');
  const { visibility, notifVisibility } = usePhoneVisibility();

  return (
      <div className={cn('transition-any ease-in-out duration-500', {
          'translate-y-0': visibility,
          'translate-y-[38rem]': !visibility && notifVisibility,
          'translate-y-[2000px]': !visibility && !notifVisibility,
      })}>
      <div className="PhoneWrapper" onClick={() => {
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

import React from 'react';
import { isDefaultWallpaper } from './apps/settings/utils/isDefaultWallpaper';
import { useSettings } from './apps/settings/hooks/useSettings';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import {useRouteMatch} from "react-router-dom";
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import {PhotoEvents} from "@typings/photo";

const PhoneWrapper: React.FC = ({ children }) => {
  const [settings] = useSettings();
  const {isExact} = useRouteMatch('/');
  const isCameraPath = useRouteMatch('/camera');
  const { visibility } = usePhoneVisibility();

  return (
      <div className={`transition-any ease-in-out duration-500 ${visibility ? 'translate-y-0' : 'translate-y-full'}`}>
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

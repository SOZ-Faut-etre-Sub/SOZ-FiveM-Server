import React from 'react';
import { isDefaultWallpaper } from './apps/settings/utils/isDefaultWallpaper';
import { useSettings } from './apps/settings/hooks/useSettings';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import { Slide } from '@mui/material';
import {useRouteMatch} from "react-router-dom";

const PhoneWrapper: React.FC = ({ children }) => {
  const [settings] = useSettings();
  const {isExact} = useRouteMatch('/');
  const { bottom, visibility } = usePhoneVisibility();

  return (
    <Slide direction="up" timeout={{ enter: 500, exit: 500 }} in={visibility}>
      <div className="PhoneWrapper">
        <div
          className="Phone"
          style={{
            position: 'fixed',
            transformOrigin: 'right bottom',
            zoom: `${settings.zoom.value}%`,
            bottom,
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
    </Slide>
  );
};

export default PhoneWrapper;

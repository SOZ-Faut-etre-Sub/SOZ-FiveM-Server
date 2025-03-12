import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { VehicleLightState } from '../../../../shared/vehicle/vehicle';
import { useAssetPath } from '../../../hook/assets';
import { RootState } from '../../../store';
import { useZoom } from '../hooks/useZoom';

export const LightIndicator: FunctionComponent = () => {
    const state = useSelector((state: RootState) => state.vehicle.lightState);
    const { width, height } = useZoom();
    const { getPath } = useAssetPath();

    const icon = state === VehicleLightState.LowBeam ? 'low' : 'high';

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: state === VehicleLightState.Off ? 0 : 1,
        },
    });

    return (
        <animated.img
            style={{ ...styles, width, height }}
            className="drop-shadow-bg"
            src={getPath(`images/hud/vehicle/light-${icon}.webp`)}
        />
    );
};

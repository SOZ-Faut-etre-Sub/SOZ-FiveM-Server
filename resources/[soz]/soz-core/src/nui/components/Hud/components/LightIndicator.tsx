import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { VehicleLightState } from '../../../../shared/vehicle/vehicle';
import { RootState } from '../../../store';

export const LightIndicator: FunctionComponent = () => {
    const state = useSelector((state: RootState) => state.vehicle.lightState);

    const icon = state === VehicleLightState.LowBeam ? 'low' : 'high';

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: state === VehicleLightState.Off ? 0 : 1,
        },
    });

    return <animated.img className="size-12" style={styles} src={`/public/images/hud/vehicle/light-${icon}.webp`} />;
};

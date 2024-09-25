import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { VehicleLockStatus } from '../../../../shared/vehicle/vehicle';
import { RootState } from '../../../store';
import { useDaltonism } from '../hooks/useDaltonism';
import { useZoom } from '../hooks/useZoom';

export const LockIndicator: FunctionComponent = () => {
    const state = useSelector((state: RootState) => state.vehicle.lockStatus);
    const { width, height } = useZoom();

    const { imagePrefix } = useDaltonism();

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: state === VehicleLockStatus.Locked ? 0 : 1,
        },
    });

    return (
        <animated.img style={{ ...styles, width, height }} src={`/public/images/hud/vehicle/${imagePrefix}lock.webp`} />
    );
};

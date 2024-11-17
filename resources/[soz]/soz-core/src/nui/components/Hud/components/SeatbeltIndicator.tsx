import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { useDaltonism } from '../hooks/useDaltonism';
import { useZoom } from '../hooks/useZoom';

export const SeatbeltIndicator: FunctionComponent = () => {
    const state = useSelector((state: RootState) => state.vehicle.seatbelt);

    const { imagePrefix } = useDaltonism();
    const { width, height } = useZoom();

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: state === false ? 1 : 0,
        },
    });

    return (
        <animated.img
            style={{ ...styles, width, height }}
            src={`https://soz.zerator.com/static/game/images/hud/vehicle/${imagePrefix}seatbelt.webp`}
        />
    );
};

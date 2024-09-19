import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';

export const SeatbeltIndicator: FunctionComponent = () => {
    const state = useSelector((state: RootState) => state.vehicle.seatbelt);

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: state === false ? 1 : 0,
        },
    });

    return <animated.img className="size-12" style={styles} src="/public/images/hud/vehicle/seatbelt.webp" />;
};

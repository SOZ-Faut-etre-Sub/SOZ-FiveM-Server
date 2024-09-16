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

    return (
        <animated.div
            className="size-12 bg-cover bg-center"
            style={{
                ...styles,
                backgroundImage: `url(/public/images/hud/vehicle/seatbelt.webp)`,
            }}
        />
    );
};

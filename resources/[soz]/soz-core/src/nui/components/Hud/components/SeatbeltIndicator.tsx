import cn from 'classnames';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';

export const SeatbeltIndicator: FunctionComponent = () => {
    const state = useSelector((state: RootState) => state.vehicle.seatbelt);

    return (
        <img
            className={cn('size-8 transition-all duration-1000', {
                'opacity-0': state === null || state === true,
                'opacity-100': state === false,
            })}
            src="/public/images/hud/vehicle/seatbelt.webp"
            alt="seatbelt"
        />
    );
};

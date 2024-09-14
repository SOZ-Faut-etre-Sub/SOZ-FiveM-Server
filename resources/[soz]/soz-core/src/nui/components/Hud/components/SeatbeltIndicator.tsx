import cn from 'classnames';
import { FunctionComponent } from 'react';

export const SeatbeltIndicator: FunctionComponent<{ state: boolean }> = ({ state }) => {
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

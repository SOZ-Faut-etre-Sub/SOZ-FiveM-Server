import cn from 'classnames';
import { FunctionComponent } from 'react';

import { VehicleLockStatus } from '../../../../shared/vehicle/vehicle';

export const LockIndicator: FunctionComponent<{ state: VehicleLockStatus }> = ({ state }) => {
    return (
        <img
            className={cn('size-8 transition-all duration-1000', {
                'opacity-0': state === VehicleLockStatus.Locked,
                'opacity-100': state !== VehicleLockStatus.Locked,
            })}
            src="/public/images/hud/vehicle/lock.webp"
            alt="lock"
        />
    );
};

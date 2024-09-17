import cn from 'classnames';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { VehicleLockStatus } from '../../../../shared/vehicle/vehicle';
import { RootState } from '../../../store';

export const LockIndicator: FunctionComponent = () => {
    const state = useSelector((state: RootState) => state.vehicle.lockStatus);

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

import cn from 'classnames';
import { FunctionComponent } from 'react';

import {
    VehicleCriticalDamageThreshold,
    VehicleHighDamageThreshold,
    VehicleMidDamageThreshold,
} from '../../../../shared/vehicle/vehicle';

export const MotorIndicator: FunctionComponent<{ motor: number; fuelType: string }> = ({ motor, fuelType }) => {
    let motorStatus = 'yellow';

    if (motor >= VehicleHighDamageThreshold && motor < VehicleMidDamageThreshold) {
        motorStatus = 'yellow';
    } else if (motor < VehicleHighDamageThreshold && motor >= VehicleCriticalDamageThreshold) {
        motorStatus = 'orange';
    } else if (motor < VehicleCriticalDamageThreshold) {
        motorStatus = 'red';
    }

    return (
        <img
            className={cn('size-8 transition-all duration-1000', {
                'opacity-5': motor >= VehicleMidDamageThreshold,
                'opacity-100': motor < VehicleMidDamageThreshold,
            })}
            src={`/public/images/hud/vehicle/${fuelType === 'essence' ? 'motor' : 'battery'}-${motorStatus}.webp`}
            alt="motor"
        />
    );
};

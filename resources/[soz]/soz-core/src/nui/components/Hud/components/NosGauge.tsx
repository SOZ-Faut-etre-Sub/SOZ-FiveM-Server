import { FunctionComponent } from 'react';
import colors from 'tailwindcss/colors';

import { useVehicle } from '../../../hook/data';
import { StatusGauge } from './StatusGauge';

export const NosGauge: FunctionComponent = () => {
    const vehicle = useVehicle();

    if (!vehicle.nosLevel) {
        return null;
    }

    return (
        <StatusGauge value={vehicle.nosLevel} color={colors.blue[500]} hideCondition={() => false}>
            <img className="size-8" src={`/public/images/hud/vehicle/motor.webp`} alt="fuel" />
        </StatusGauge>
    );
};

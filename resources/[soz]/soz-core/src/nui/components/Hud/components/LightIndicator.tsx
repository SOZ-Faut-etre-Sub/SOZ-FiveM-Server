import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { VehicleLightState } from '../../../../shared/vehicle/vehicle';
import { RootState } from '../../../store';

export const LightIndicator: FunctionComponent = () => {
    const state = useSelector((state: RootState) => state.vehicle.lightState);

    let icon = null;

    if (state === VehicleLightState.LowBeam) {
        icon = 'low';
    } else if (state === VehicleLightState.HighBeam) {
        icon = 'high';
    }

    if (!icon) {
        return null;
    }

    return <img className="size-10" src={`/public/images/hud/vehicle/light-${icon}.webp`} alt="light" />;
};

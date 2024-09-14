import { FunctionComponent } from 'react';

import { VehicleLightState } from '../../../../shared/vehicle/vehicle';

export const LightIndicator: FunctionComponent<{ state: VehicleLightState }> = ({ state }) => {
    let icon = 'off';

    if (state === VehicleLightState.LowBeam) {
        icon = 'low';
    } else if (state === VehicleLightState.HighBeam) {
        icon = 'high';
    }

    return <img className="size-10" src={`/public/images/hud/vehicle/light-${icon}.webp`} alt="light" />;
};

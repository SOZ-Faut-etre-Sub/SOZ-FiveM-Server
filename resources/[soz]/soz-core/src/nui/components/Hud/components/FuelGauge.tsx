import { FunctionComponent } from 'react';

import { getDefaultVehicleCondition, VehicleClassFuelStorageMultiplier } from '../../../../shared/vehicle/vehicle';
import { StatusGauge } from './StatusGauge';

export const FuelGauge: FunctionComponent<{ value: number; fuelType: string; vehCategory: string }> = ({
    value,
    fuelType,
    vehCategory,
}) => {
    const maxFuel = getDefaultVehicleCondition().fuelLevel * (VehicleClassFuelStorageMultiplier[vehCategory] || 1.0);

    let gaugeColor = '#F39C12';

    if (fuelType === 'electric') {
        gaugeColor = '#00E949';

        if (value < 60 && value >= 30) {
            gaugeColor = '#F39C12';
        } else if (value < 30) {
            gaugeColor = '#92212B';
        }
    }

    return (
        <StatusGauge value={Math.min(value, maxFuel)} max={maxFuel} color={gaugeColor} hideCondition={() => false}>
            <img
                className="size-8"
                src={`/public/images/hud/vehicle/${fuelType === 'electric' ? 'battery' : 'motor'}.webp`}
                alt="fuel"
            />
        </StatusGauge>
    );
};

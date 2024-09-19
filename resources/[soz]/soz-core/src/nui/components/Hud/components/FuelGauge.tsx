import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { getDefaultVehicleCondition, VehicleClassFuelStorageMultiplier } from '../../../../shared/vehicle/vehicle';
import { RootState } from '../../../store';
import { useDaltonism } from '../hooks/useDaltonism';
import { StatusGauge } from './StatusGauge';

export const FuelGauge: FunctionComponent = () => {
    const fuelType = useSelector((state: RootState) => state.vehicle.fuelType);
    const fuelLevel = useSelector((state: RootState) => state.vehicle.fuelLevel);
    const vehCategory = useSelector((state: RootState) => state.vehicle.vehCategory);

    const { gauge_colors } = useDaltonism();

    const maxFuel = getDefaultVehicleCondition().fuelLevel * (VehicleClassFuelStorageMultiplier[vehCategory] || 1.0);

    let gaugeColor = [gauge_colors.orange_light, gauge_colors.orange_dark];

    if (fuelType === 'electric') {
        gaugeColor = [gauge_colors.green_light, gauge_colors.green_dark];

        if (fuelLevel < 60 && fuelLevel >= 30) {
            gaugeColor = [gauge_colors.orange_light, gauge_colors.orange_dark];
        }
    }

    if (fuelLevel < 30) {
        gaugeColor = [gauge_colors.red_light, gauge_colors.red_dark];
    }

    if (fuelType === 'none') {
        return null;
    }

    return (
        <StatusGauge
            max={maxFuel}
            value={Math.min(fuelLevel, maxFuel)}
            color={gaugeColor[0]}
            backgroundColor={gaugeColor[1]}
            hideCondition={() => false}
        >
            <img
                className="size-8"
                src={`/public/images/hud/vehicle/${fuelType === 'electric' ? 'battery' : 'motor'}.webp`}
                alt="fuel"
            />
        </StatusGauge>
    );
};

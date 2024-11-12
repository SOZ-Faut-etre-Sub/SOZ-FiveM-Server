import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { getDefaultVehicleCondition, VehicleClassFuelStorageMultiplier } from '../../../../shared/vehicle/vehicle';
import { RootState } from '../../../store';
import { useHudColor } from '../hooks/useHudColor';
import { useZoom } from '../hooks/useZoom';
import { StatusGauge } from './StatusGauge';

export const FuelGauge: FunctionComponent = () => {
    const fuelType = useSelector((state: RootState) => state.vehicle.fuelType);
    const fuelLevel = useSelector((state: RootState) => state.vehicle.fuelLevel);
    const vehCategory = useSelector((state: RootState) => state.vehicle.vehCategory);

    const { gaugeColors } = useHudColor();
    const { iconSize } = useZoom();

    const maxFuel = getDefaultVehicleCondition().fuelLevel * (VehicleClassFuelStorageMultiplier[vehCategory] || 1.0);

    let gaugeColor = [gaugeColors.orange_light, gaugeColors.orange_dark];

    if (fuelType === 'electric') {
        gaugeColor = [gaugeColors.green_light, gaugeColors.green_dark];

        if (fuelLevel < 60 && fuelLevel >= 30) {
            gaugeColor = [gaugeColors.orange_light, gaugeColors.orange_dark];
        }
    }

    if (fuelLevel < 30) {
        gaugeColor = [gaugeColors.red_light, gaugeColors.red_dark];
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
                style={{
                    width: iconSize,
                    height: iconSize,
                }}
                src={`/public/images/hud/vehicle/${fuelType === 'electric' ? 'battery' : 'motor'}.webp`}
                alt="fuel"
            />
        </StatusGauge>
    );
};

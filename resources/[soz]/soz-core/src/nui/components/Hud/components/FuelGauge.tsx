import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { getDefaultVehicleCondition, VehicleClassFuelStorageMultiplier } from '../../../../shared/vehicle/vehicle';
import { RootState } from '../../../store';
import { StatusGauge } from './StatusGauge';

export const FuelGauge: FunctionComponent = () => {
    const fuelType = useSelector((state: RootState) => state.vehicle.fuelType);
    const fuelLevel = useSelector((state: RootState) => state.vehicle.fuelLevel);
    const vehCategory = useSelector((state: RootState) => state.vehicle.vehCategory);

    const maxFuel = getDefaultVehicleCondition().fuelLevel * (VehicleClassFuelStorageMultiplier[vehCategory] || 1.0);

    let gaugeColor = '#F39C12';

    if (fuelType === 'electric') {
        gaugeColor = '#00E949';

        if (fuelLevel < 60 && fuelLevel >= 30) {
            gaugeColor = '#F39C12';
        } else if (fuelLevel < 30) {
            gaugeColor = '#92212B';
        }
    }

    if (fuelType === 'none') {
        return null;
    }

    return (
        <StatusGauge value={Math.min(fuelLevel, maxFuel)} max={maxFuel} color={gaugeColor} hideCondition={() => false}>
            <img
                className="size-8"
                src={`/public/images/hud/vehicle/${fuelType === 'electric' ? 'battery' : 'motor'}.webp`}
                alt="fuel"
            />
        </StatusGauge>
    );
};

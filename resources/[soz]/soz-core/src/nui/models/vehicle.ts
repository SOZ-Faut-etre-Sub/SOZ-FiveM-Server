import { createModel } from '@rematch/core';

import { VehicleHud } from '../../shared/vehicle/vehicle';
import type { RootModel } from './';

export const vehicle = createModel<RootModel>()({
    state: {
        seat: null,
        speed: 0,
        engineHealth: 0,
        oilLevel: 0,
        lockStatus: 0,
        seatbelt: false,
        lightState: 0,
        fuelType: 'essence',
        fuelLevel: 0,
        rpm: 0,
    } as VehicleHud,
    reducers: {
        update(state, vehicle: Partial<VehicleHud>) {
            return { ...state, ...vehicle };
        },
    },
    effects: () => ({}),
});

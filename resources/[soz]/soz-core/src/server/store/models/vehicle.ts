import { createModel } from '@rematch/core';

import { getDefaultVehicleState, VehicleEntityState } from '../../../shared/vehicle/vehicle';
import type { RootModel } from './';

type VehicleState = {
    subscribers: number[];
    vehicle: VehicleEntityState;
};

export const vehicle = createModel<RootModel>()({
    state: {} as Record<number, VehicleState>,
    reducers: {
        update(
            state,
            {
                id,
                vehicle,
            }: {
                id: number;
                vehicle: Partial<VehicleEntityState>;
            }
        ) {
            return { ...state, [id]: { ...getDefaultVehicleState(), ...state[id], ...vehicle } };
        },
    },
    effects: () => ({}),
});

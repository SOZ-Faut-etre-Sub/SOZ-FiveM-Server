import { createModel } from '@rematch/core';

import { getDefaultVehicleVolatileState, VehicleVolatileState } from '../../../shared/vehicle/vehicle';
import type { RootModel } from './';

type VehicleState = {
    subscribers: number[];
    vehicle: VehicleVolatileState;
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
                vehicle: Partial<VehicleVolatileState>;
            }
        ) {
            return { ...state, [id]: { ...getDefaultVehicleVolatileState(), ...state[id], ...vehicle } };
        },
    },
    effects: () => ({}),
});

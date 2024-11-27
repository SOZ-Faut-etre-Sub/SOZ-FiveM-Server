import { Vector3 } from '../shared/polyzone/vector';
import { Location } from './ceremony';

const spotlightDefault = {
    color: [255, 255, 255] as Vector3,
    distance: 500,
    radius: 50,
    duration: 1_000,
    brightness: 0.5,
    roundness: 10,
};

export const FINAL_LOCATION: Location = {
    camera: [-734.39, -1840.8, 237.96],
    center: [40.6, 627.09, 240.89],
    positions: [
        { position: [-351.25, -1922.89, 392.49], rotation: [0, 0, 0], duration: 10_000, triggerAt: 0 },
        { position: [279.51, -750.36, 278.2], rotation: [0, 0, 0], duration: 10_000, triggerAt: 10_000 },
    ],
    fireworks: [],
    spotlights: [
        {
            action: 'add',
            id: 'final-towers-1',
            position: [310.83, -1310.46, 446.92],
            target: [-65.33, -827.49, 86.14],
            ...spotlightDefault,
            triggerAt: 0,
        },
        {
            action: 'add',
            id: 'final-towers-2',
            position: [-670.16, -1104.81, 462.82],
            target: [-65.33, -827.49, 86.14],
            ...spotlightDefault,
            triggerAt: 0,
        },
        // ---
        {
            action: 'add',
            id: 'final-tower-senat',
            position: [-520.03, -738.36, 119.01],
            target: [-558.05, -586.49, 37.26],
            ...spotlightDefault,
            triggerAt: 0,
        },
    ],
    duration: 20_000,
};

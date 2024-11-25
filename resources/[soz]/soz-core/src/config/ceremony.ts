import { FireworkType } from '../shared/firework';
import { Vector3, Vector4 } from '../shared/polyzone/vector';

export const CAMERA_TRANSITION_DURATION = 1_500;

export type Location = {
    camera: Vector3;
    center: Vector3;
    positions: {
        position: Vector3;
        rotation: Vector3;
        duration: number;
    }[];
    fireworks: {
        type: FireworkType;
        trigger: Vector4;
        explosive: Vector3;
        triggerAt: number;
    }[];
    spotlights: {
        id: string;
        action: 'add' | 'update' | 'remove';
        position?: Vector3;
        target?: Vector3;
        color?: Vector3;
        distance?: number;
        radius?: number;
        roundness?: number;
        duration: number;
        brightness: number;
        triggerAt: number;
    }[];
    duration: number;
};

const BCSO_LOCATION: Location = {
    camera: [1864.99, 3606.66, 63.28],
    center: [1850.94, 3689.7, 50.26],
    positions: [
        // { position: [1927.22, 3685.23, 162.57], rotation: [0, 0, 0], duration: 10_000 },
        // { position: [1851.52, 3727.56, 34.8], rotation: [0, 0, 0], duration: 6_000 },
        // { position: [1870.93, 3688.03, 34.79], rotation: [0, 0, 0], duration: 6_000 },
        // { position: [1858.3, 3678.72, 34.12], rotation: [0, 0, 0], duration: 6_000 },
        // { position: [1856.27, 3628.85, 59.36], rotation: [0, 0, 0], duration: 10_000 },
    ],
    fireworks: [
        {
            type: FireworkType.Fountain,
            trigger: [1834.43, 3698.72, 38.02, 0.0],
            explosive: [1834.43, 3698.72, 38.02],
            triggerAt: 1_000,
        },
        {
            type: FireworkType.Fountain,
            trigger: [1830.38, 3696.58, 38.01, 0.0],
            explosive: [1830.38, 3696.58, 38.01],
            triggerAt: 1_000,
        },
        {
            type: FireworkType.Fountain,
            trigger: [1824.7, 3693.26, 38.02, 0.0],
            explosive: [1824.7, 3693.26, 38.02],
            triggerAt: 1_000,
        },
        {
            type: FireworkType.RingBurst,
            trigger: [1833.4, 3672.3, 38.28, 0.0],
            explosive: [1833.4, 3672.3, 58.28],
            triggerAt: 2_000,
        },
        {
            type: FireworkType.Burst,
            trigger: [1826.46, 3667.72, 38.28, 0.0],
            explosive: [1826.46, 3667.72, 58.28],
            triggerAt: 2_500,
        },
        {
            type: FireworkType.SpiralBurst,
            trigger: [1845.93, 3680.04, 38.28, 0.0],
            explosive: [1845.93, 3680.04, 58.28],
            triggerAt: 2_500,
        },
        {
            type: FireworkType.Burst,
            trigger: [1865.88, 3680.82, 34.22, 0.0],
            explosive: [1865.88, 3680.82, 54.22],
            triggerAt: 3_000,
        },
        {
            type: FireworkType.SpiralBurst2,
            trigger: [1868.39, 3684.16, 34.27, 0.0],
            explosive: [1868.39, 3684.16, 54.27],
            triggerAt: 4_000,
        },
        {
            type: FireworkType.Burst,
            trigger: [1861.55, 3681.45, 34.3, 0.0],
            explosive: [1861.55, 3681.45, 54.3],
            triggerAt: 5_000,
        },
    ],
    spotlights: [
        {
            action: 'add',
            id: 'bcso-spotlight-1',
            position: [1852.61, 3654.53, 39.4],
            target: [1850.94, 3689.7, 34.26],
            color: [255, 0, 0],
            distance: 100,
            radius: 50,
            duration: 1_000,
            brightness: 100,
            roundness: 50,
            triggerAt: 10,
        },
        {
            action: 'update',
            id: 'bcso-spotlight-1',
            brightness: 0,
            duration: 2_000,
            triggerAt: 3000,
        },
        {
            action: 'update',
            id: 'bcso-spotlight-1',
            brightness: 100,
            duration: 2_000,
            triggerAt: 7000,
        },
    ],
    duration: 10_000,
};

// const LSPD_LOCATION: Location = {
//     camera: [703.74, 11.11, 104.62],
//     center: [630.97, 4.98, 82.92],
//     positions: [],
//     fireworks: [],
//     duration: 1000,
// };

// const STONK_LOCATION: Location = {
//     camera: [26.49, -752.73, 47.0],
//     center: [-1.28, -692.8, 47.31],
//     positions: [],
//     fireworks: [],
//     duration: 1000,
// };

// const MANDATORY_LOCATION: Location = {
//     camera: [-475.88, -296.41, 63.21],
//     center: [-551.4, -193.3, 38.19],
//     positions: [],
//     fireworks: [],
//     duration: 1000,
// };

// const SENAT_LOCATION: Location = {
//     camera: [-529.69, -698.66, 66.3],
//     center: [-556.14, -599.25, 34.92],
//     positions: [],
//     fireworks: [],
//     duration: 1000,
// };

export const ALL_LOCATIONS: Location[] = [
    BCSO_LOCATION,
    // LSPD_LOCATION,
    // STONK_LOCATION,
    // MANDATORY_LOCATION,
    // SENAT_LOCATION,
];

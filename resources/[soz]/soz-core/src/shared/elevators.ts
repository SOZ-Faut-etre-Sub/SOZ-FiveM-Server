import { JobType } from './job';
import { BoxZone } from './polyzone/box.zone';
import { Vector2, Vector3, Vector4 } from './polyzone/vector';

export enum DynamicElevator {
    MirrorParkLSPD1 = 'MirrorParkLSPD1',
    MirrorParkLSPD2 = 'MirrorParkLSPD2',
}

export enum Interior {
    MirrorParkLSPD_0 = 'MirrorParkLSPD_0',
    MirrorParkLSPD_1 = 'MirrorParkLSPD_1',
}

export const InteriorsLocation: Record<Interior, Vector3> = {
    MirrorParkLSPD_0: [1150.53955, -469.072, 60.6435],
    MirrorParkLSPD_1: [1149.92883, -459.462555, 70.1152],
};

export type DynamicElevatorConfig = {
    position: Vector2;
    model: string;
    doormodel: string;
    heading: number;
    doorsInternal: {
        open: Vector2;
        close: Vector2;
        offset: Vector3;
    }[];
    floors: {
        z: number;
        label: string;
        doorz: number;
        button: BoxZone;
        doors: {
            open: Vector2;
            close: Vector2;
        }[];
        doorsInternalIndex: number[];
        interior: Interior;
        room: string;
        order: string;
    }[];
    emergency: BoxZone;
    emergencyTarget: Vector4;
};

export const DynamicElevatorParams = {
    speed: 0.5,
    doorSpeed: 0.5,
};

export const DynamicElevatorConfigs: Record<DynamicElevator, DynamicElevatorConfig> = {
    [DynamicElevator.MirrorParkLSPD1]: {
        position: [1133.15942, -474.516418],
        doorsInternal: [
            {
                close: [1132.60376, -475.708252],
                open: [1132.06982, -475.581635],
                offset: [-1.2878930568695068, 0.2656334340572357, -1.5239410400390625],
            },
            {
                close: [1133.15393, -475.7908],
                open: [1133.68811, -475.91748],
                offset: [-1.2412551641464233, -0.28873783349990845, -1.5239410400390625],
            },
            {
                close: [1133.17322, -473.241119],
                open: [1132.635, -473.1135],
                offset: [1.2440614700317383, 0.2808723449707031, -1.5239410400390625],
            },
            {
                close: [1133.7229, -473.3231],
                open: [1134.259, -473.450226],
                offset: [1.2911510467529297, -0.27288997173309326, -1.5239410400390625],
            },
        ],
        floors: [
            {
                z: 61.923336,
                label: '-1',
                doorz: 60.39939,
                doors: [
                    {
                        close: [1132.5741, -475.8562],
                        open: [1132.044, -475.730469],
                    },
                    {
                        close: [1133.12622, -475.9405],
                        open: [1133.65308, -476.06546],
                    },
                ],
                button: new BoxZone([1131.99, -476.06, 60.3], 0.15, 0.2, {
                    heading: 168.31,
                    minZ: 60.3,
                    maxZ: 60.7,
                }),
                doorsInternalIndex: [0, 1],
                interior: Interior.MirrorParkLSPD_0,
                room: '-1_corridor',
                order: '5',
            },
            {
                z: 66.80515,
                label: '1',
                doorz: 65.28121,
                doors: [
                    {
                        close: [1132.5741, -475.8562],
                        open: [1132.044, -475.730469],
                    },
                    {
                        close: [1133.12622, -475.9405],
                        open: [1133.65308, -476.06546],
                    },
                ],
                button: new BoxZone([1132.0, -476.04, 65.15], 0.2, 0.2, {
                    heading: 169.83,
                    minZ: 65.15,
                    maxZ: 65.55,
                }),
                doorsInternalIndex: [0, 1],
                interior: Interior.MirrorParkLSPD_1,
                room: '0_atrium',
                order: '4',
            },
            {
                z: 70.52464,
                label: '2',
                doorz: 69.0007,
                doors: [
                    {
                        close: [1133.22144, -473.056183],
                        open: [1132.6969, -472.9318],
                    },
                    {
                        close: [1133.754, -473.2272],
                        open: [1134.28271, -473.3526],
                    },
                ],
                button: new BoxZone([1134.35, -472.96, 69.28], 0.2, 0.2, {
                    heading: 349.8,
                    minZ: 68.88,
                    maxZ: 69.28,
                }),
                doorsInternalIndex: [2, 3],
                interior: Interior.MirrorParkLSPD_1,
                room: '0_atrium',
                order: '3',
            },
            {
                z: 74.26419,
                label: '3',
                doorz: 72.74025,
                doors: [
                    {
                        close: [1133.22144, -473.056183],
                        open: [1132.6969, -472.9318],
                    },
                    {
                        close: [1133.754, -473.2272],
                        open: [1134.28271, -473.3526],
                    },
                ],
                button: new BoxZone([1134.33, -472.95, 72.5], 0.2, 0.2, {
                    heading: 345.83,
                    minZ: 72.7,
                    maxZ: 73.0,
                }),
                doorsInternalIndex: [2, 3],
                interior: Interior.MirrorParkLSPD_1,
                room: '0_atrium',
                order: '2',
            },
            {
                z: 77.99447,
                label: '4',
                doorz: 76.47053,
                doors: [
                    {
                        close: [1133.22144, -473.056183],
                        open: [1132.6969, -472.9318],
                    },
                    {
                        close: [1133.754, -473.2272],
                        open: [1134.28271, -473.3526],
                    },
                ],
                button: new BoxZone([1134.32, -473.07, 76.54], 0.4, 0.2, {
                    heading: -10.34,
                    minZ: 76.34,
                    maxZ: 76.74,
                }),
                doorsInternalIndex: [2, 3],
                interior: null,
                room: null,
                order: '1',
            },
        ],
        heading: 76.6579028,
        model: 'cube_mppd_elevator_cab',
        doormodel: 'cube_mppd_elevator_door',
        emergency: new BoxZone([1133.2, -474.42, 57.91], 2.6, 2.0, {
            heading: 166.31,
            minZ: 56.91,
            maxZ: 58.91,
        }),
        emergencyTarget: [1132.39, -476.54, 60.28, 179.12],
    },
    [DynamicElevator.MirrorParkLSPD2]: {
        position: [1153.38818, -441.327942],
        doorsInternal: [
            {
                close: [1152.83252, -442.519775],
                open: [1152.29858, -442.393158],
                offset: [-1.2878930568695068, 0.2656334340572357, -1.5239410400390625],
            },
            {
                close: [1153.38269, -442.602325],
                open: [1153.91687, -442.729],
                offset: [-1.2412551641464233, -0.28873783349990845, -1.5239410400390625],
            },
            {
                close: [1153.402, -440.052643],
                open: [1152.86377, -439.925018],
                offset: [1.2440614700317383, 0.2808723449707031, -1.5239410400390625],
            },
            {
                close: [1153.95166, -440.1346],
                open: [1154.48779, -440.261749],
                offset: [1.2911510467529297, -0.27288997173309326, -1.5239410400390625],
            },
        ],
        floors: [
            {
                z: 61.923336,
                label: '-1',
                doorz: 60.39939,
                doors: [
                    {
                        close: [1152.80286, -442.667725],
                        open: [1152.27271, -442.542],
                    },
                    {
                        close: [1153.355, -442.752],
                        open: [1153.88184, -442.876984],
                    },
                ],
                button: new BoxZone([1152.24, -442.85, 60.48], 0.2, 0.2, {
                    heading: 165.94,
                    minZ: 60.33,
                    maxZ: 60.68,
                }),
                doorsInternalIndex: [0, 1],
                interior: Interior.MirrorParkLSPD_0,
                room: '-1_corridor',
                order: '5',
            },
            {
                z: 66.80515,
                label: '1',
                doorz: 65.28121,
                doors: [
                    {
                        close: [1153.45081, -439.867859],
                        open: [1152.92566, -439.743317],
                    },
                    {
                        close: [1153.98279, -440.038727],
                        open: [1154.51147, -440.164124],
                    },
                ],
                button: new BoxZone([1154.57, -439.77, 65.24], 0.2, 0.2, {
                    heading: 349.06,
                    minZ: 65.24,
                    maxZ: 65.54,
                }),
                doorsInternalIndex: [2, 3],
                interior: Interior.MirrorParkLSPD_1,
                room: '0_corridor',
                order: '4',
            },
            {
                z: 70.52464,
                label: '2',
                doorz: 69.0007,
                doors: [
                    {
                        close: [1153.45081, -439.867859],
                        open: [1152.92566, -439.743317],
                    },
                    {
                        close: [1153.98279, -440.038727],
                        open: [1154.51147, -440.164124],
                    },
                ],
                button: new BoxZone([1154.59, -439.77, 69.05], 0.2, 0.3, {
                    heading: 347.69,
                    minZ: 68.9,
                    maxZ: 69.25,
                }),
                doorsInternalIndex: [2, 3],
                interior: Interior.MirrorParkLSPD_1,
                room: '1_corridor',
                order: '3',
            },
            {
                z: 74.26419,
                label: '3',
                doorz: 72.74025,
                doors: [
                    {
                        close: [1153.45081, -439.867859],
                        open: [1152.92566, -439.743317],
                    },
                    {
                        close: [1153.98279, -440.038727],
                        open: [1154.51147, -440.164124],
                    },
                ],
                button: new BoxZone([1154.58, -439.79, 72.89], 0.2, 0.2, {
                    heading: -12.54,
                    minZ: 72.69,
                    maxZ: 72.99,
                }),
                doorsInternalIndex: [2, 3],
                interior: Interior.MirrorParkLSPD_1,
                room: '2_corridor',
                order: '2',
            },
            {
                z: 77.99447,
                label: '4',
                doorz: 76.47053,
                doors: [
                    {
                        close: [1153.45081, -439.867859],
                        open: [1152.92566, -439.743317],
                    },
                    {
                        close: [1153.98279, -440.038727],
                        open: [1154.51147, -440.164124],
                    },
                ],
                button: new BoxZone([1154.53, -439.92, 76.34], 0.4, 0.4, {
                    heading: 347.7,
                    minZ: 76.34,
                    maxZ: 76.74,
                }),
                doorsInternalIndex: [2, 3],
                interior: null,
                room: null,
                order: '1',
            },
        ],
        heading: 76.6579028,
        model: 'cube_mppd_elevator_cab',
        doormodel: 'cube_mppd_elevator_door',
        emergency: new BoxZone([1153.38, -441.42, 57.9], 2.2, 1.8, {
            heading: 167.85,
            minZ: 56.9,
            maxZ: 58.9,
        }),
        emergencyTarget: [1151.31, -441.03, 60.28, 72.67],
    },
};

export type DynamicElevatorState = {
    id: DynamicElevator;
    current: number;
    doorState: boolean;
    next: number[];
    timer: number;
    inmotion: boolean;
    music: string;
};

export enum ElevatorDirection {
    UP = 'upTo',
    DOWN = 'downTo',
}

export const ElevatorDirectionDisplay: Record<ElevatorDirection, { label: string; icon: string }> = {
    [ElevatorDirection.UP]: { label: 'Monter ', icon: 'elevators/monter' },
    [ElevatorDirection.DOWN]: { label: 'Descendre ', icon: 'elevators/descendre' },
};

export type ElevatorFloor = {
    label: string;
    button: BoxZone;
    upTo: ElevatorFloorName[];
    downTo: ElevatorFloorName[];
    spawnPoint: Vector4;
    job?: Partial<Record<JobType, number>>;
    requireCasinoVip?: boolean;
};

export enum ElevatorFloorName {
    stonk0 = 1,
    stonk1L,
    stonk1R,
    stonk2L,
    stonk2R,
    lsmc0,
    lsmc1,
    lsmc2,
    lspd0,
    lspd1,
    bennys0,
    bennys1,
    fib0,
    fib1,
    // admin0, // Removed due to laser game
    // adminminus1, // Removed due to laser game
    mtp0,
    mtp1,
    mtp2,
    younews0,
    younews1,
    younews2,
    baun0,
    baun1,
    casino0,
    casino1,
    casino2,
    casinoVip0,
    casinoVip1,
    casinoPenthouse0,
    casinoPenthouse1,
}

export const Elevators: Record<ElevatorFloorName, ElevatorFloor> = {
    //Stonk
    [ElevatorFloorName.stonk0]: {
        label: 'Sous-sol',
        button: new BoxZone([11.99, -668.57, 33.48], 0.1, 0.35, { minZ: 33.48, maxZ: 34.05, heading: 6.3 }),
        upTo: [ElevatorFloorName.stonk1L, ElevatorFloorName.stonk2L],
        downTo: [],
        spawnPoint: [10.53, -671.79, 32.45, 359.77],
    },
    [ElevatorFloorName.stonk1L]: {
        // Level 1, Left-side (facing elevators from outside)
        label: 'Coffre',
        button: new BoxZone([15.79, -689.22, 40.6], 0.1, 0.35, { minZ: 40.6, maxZ: 41.1, heading: 24.38 }),
        upTo: [ElevatorFloorName.stonk2L],
        downTo: [ElevatorFloorName.stonk0],
        spawnPoint: [17.27, -690.0, 39.73, 23.0],
    },
    [ElevatorFloorName.stonk1R]: {
        // Level 1, Right-side (facing elevators from outside)
        label: 'Coffre',
        button: new BoxZone([13.05, -690.47, 40.6], 0.1, 0.35, { minZ: 40.6, maxZ: 41.1, heading: 24.38 }),
        upTo: [ElevatorFloorName.stonk2R],
        downTo: [ElevatorFloorName.stonk0],
        spawnPoint: [14.59, -691.35, 39.73, 23.0],
    },
    [ElevatorFloorName.stonk2L]: {
        // Level 2, Left-side (facing elevators from outside)
        label: 'Niveau principal',
        button: new BoxZone([15.75, -689.18, 45.9], 0.1, 0.35, { minZ: 45.9, maxZ: 46.4, heading: 24.38 }),
        upTo: [],
        downTo: [ElevatorFloorName.stonk1L, ElevatorFloorName.stonk0],
        spawnPoint: [17.3, -689.98, 45.01, 23.0],
    },
    [ElevatorFloorName.stonk2R]: {
        // Level 2, Right-side (facing elevators from outside)
        label: 'Niveau principal',
        button: new BoxZone([13.09, -690.53, 45.9], 0.1, 0.35, { minZ: 45.9, maxZ: 46.4, heading: 24.38 }),
        upTo: [],
        downTo: [ElevatorFloorName.stonk1R, ElevatorFloorName.stonk0],
        spawnPoint: [14.58, -691.15, 45.01, 26.12],
    },
    //LSMC
    [ElevatorFloorName.lsmc0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([362.97, -1427.64, 32.91], 0.5, 0.3, { minZ: 32.91, maxZ: 33.31, heading: 227.56 }),
        upTo: [ElevatorFloorName.lsmc1, ElevatorFloorName.lsmc2],
        downTo: [],
        spawnPoint: [364.94, -1426.28, 32.51, 228.85],
    },
    [ElevatorFloorName.lsmc1]: {
        label: '1er Etage',
        button: new BoxZone([362.62, -1427.32, 38.44], 0.3, 0.9, { minZ: 38.44, maxZ: 38.79, heading: 318.33 }),
        upTo: [ElevatorFloorName.lsmc2],
        downTo: [ElevatorFloorName.lsmc0],
        spawnPoint: [365.18, -1426.5, 37.98, 228.85],
    },
    [ElevatorFloorName.lsmc2]: {
        label: 'Toit',
        button: new BoxZone([333.35, -1430.19, 47.21], 0.3, 0.4, { heading: 138.09, minZ: 47.01, maxZ: 47.31 }),
        upTo: [],
        downTo: [ElevatorFloorName.lsmc0, ElevatorFloorName.lsmc1],
        spawnPoint: [334.41, -1432.06, 46.52, 134.22],
    },
    //LSPD
    [ElevatorFloorName.lspd0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([609.72, -0.13, 69.63], 0.9, 0.1, { minZ: 69.63, maxZ: 72.08, heading: 350 }),
        upTo: [ElevatorFloorName.lspd1],
        downTo: [],
        spawnPoint: [611.07, -1.55, 70.63, 86.33],
    },
    [ElevatorFloorName.lspd1]: {
        label: 'Toit',
        button: new BoxZone([565.19, 4.88, 102.23], 1.45, 0.4, { minZ: 102.23, maxZ: 104.63, heading: 0 }),
        upTo: [],
        downTo: [ElevatorFloorName.lspd0],
        spawnPoint: [565.96, 4.89, 103.23, 271.47],
    },
    //BENNY'S
    [ElevatorFloorName.bennys0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([-173.83, -1272.33, 32.6], 0.2, 0.1, { minZ: 32.6, maxZ: 33.0, heading: 0 }),
        upTo: [ElevatorFloorName.bennys1],
        downTo: [],
        spawnPoint: [-172.57, -1273.25, 32.6, 86.66],
    },
    [ElevatorFloorName.bennys1]: {
        label: 'Toit',
        button: new BoxZone([-171.17, -1274.1, 48.0], 0.2, 0.1, { minZ: 48.0, maxZ: 48.2, heading: 0 }),
        upTo: [],
        downTo: [ElevatorFloorName.bennys0],
        spawnPoint: [-172.49, -1273.3, 47.9, 270.31],
    },
    //FIB
    [ElevatorFloorName.fib0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([138.08, -763.93, 45.45], 0.05, 3.35, { minZ: 45.45, maxZ: 46.35, heading: 340 }),
        upTo: [ElevatorFloorName.fib1],
        downTo: [],
        spawnPoint: [136.14, -761.89, 45.75, 162.03],
    },
    [ElevatorFloorName.fib1]: {
        label: 'Étage',
        button: new BoxZone([136.64, -763.4, 241.9], 0.05, 0.35, { minZ: 241.9, maxZ: 242.75, heading: 340 }),
        upTo: [],
        downTo: [ElevatorFloorName.fib0],
        spawnPoint: [135.99, -761.77, 242.15, 161.57],
    },
    //Admin - Removed due to laser game
    // [ElevatorFloorName.admin0]: {
    //     label: 'Surface',
    //     button: new BoxZone([1982.81, 3026.07, 46.91], 1.4, 0.1, { minZ: 46.91, maxZ: 49.31, heading: 59 }),
    //     upTo: [],
    //     downTo: [ElevatorFloorName.adminminus1],
    //     spawnPoint: [1983.47, 3027.05, 47.34, 330.03],
    // },
    // [ElevatorFloorName.adminminus1]: {
    //     label: 'Sous-Sol',
    //     button: new BoxZone([2154.9, 2919.62, -81.28], 0.2, 0.05, { minZ: -81.28, maxZ: -80.78, heading: 91 }),
    //     upTo: [ElevatorFloorName.admin0],
    //     downTo: [],
    //     spawnPoint: [2154.62, 2920.95, -81.08, 272.4],
    //     job: {
    //         [JobType.FBI]: 0,
    //         [JobType.LSPD]: 0,
    //         [JobType.BCSO]: 0,
    //         [JobType.SASP]: 0,
    //         [JobType.Gouv]: 0,
    //         [JobType.LSCS]: 0,
    //     },
    // },
    //MTP
    [ElevatorFloorName.mtp0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([-247.36, 6083.0, 31.38], 0.4, 0.6, {
            heading: 135.27,
            minZ: 30.38,
            maxZ: 32.98,
        }),
        upTo: [ElevatorFloorName.mtp1, ElevatorFloorName.mtp2],
        downTo: [],
        spawnPoint: [-247.59, 6081.25, 30.39, 313.56],
    },
    [ElevatorFloorName.mtp1]: {
        label: 'Étage',
        button: new BoxZone([-247.36, 6083.0, 39.57], 0.4, 0.6, {
            heading: 135.27,
            minZ: 39.57,
            maxZ: 42.57,
        }),
        upTo: [ElevatorFloorName.mtp2],
        downTo: [ElevatorFloorName.mtp0],
        spawnPoint: [-247.32, 6081.62, 39.57, 328.02],
    },
    [ElevatorFloorName.mtp2]: {
        label: 'Toit',
        button: new BoxZone([-244.09, 6076.16, 50.22], 0.1, 0.4, { minZ: 50.22, maxZ: 53.22, heading: 315 }),
        upTo: [],
        downTo: [ElevatorFloorName.mtp1, ElevatorFloorName.mtp0],
        spawnPoint: [-244.1, 6074.65, 50.22, 310.85],
    },
    //You News
    [ElevatorFloorName.younews0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([-1074.48, -253.17, 37.86], 0.4, 0.2, { minZ: 37.86, maxZ: 38.06, heading: 315 }),
        upTo: [ElevatorFloorName.younews1, ElevatorFloorName.younews2],
        downTo: [],
        spawnPoint: [-1075.63, -252.99, 36.96, 30.87],
    },
    [ElevatorFloorName.younews1]: {
        label: 'Bureau',
        button: new BoxZone([-1074.57, -253.02, 44.12], 0.2, 0.2, { minZ: 44.12, maxZ: 44.37, heading: 27.18 }),
        upTo: [ElevatorFloorName.younews2],
        downTo: [ElevatorFloorName.younews0],
        spawnPoint: [-1075.45, -252.97, 43.22, 31.92],
    },
    [ElevatorFloorName.younews2]: {
        label: 'Toit',
        button: new BoxZone([-1073.21, -246.92, 53.01], 1.0, 1.2, { minZ: 53.01, maxZ: 55.01, heading: 315 }),
        upTo: [],
        downTo: [ElevatorFloorName.younews1, ElevatorFloorName.younews0],
        spawnPoint: [-1072.38, -246.64, 53.21, 302.0],
    },
    //BAHAMA
    [ElevatorFloorName.baun0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([-1383.44, -589.6, 30.32], 0.2, 0.4, { heading: 215.27, minZ: 30.12, maxZ: 30.92 }),
        upTo: [ElevatorFloorName.baun1],
        downTo: [],
        spawnPoint: [-1382.07, -589.92, 30.32, 30.76],
    },
    [ElevatorFloorName.baun1]: {
        label: 'Roof Top',
        button: new BoxZone([-1379.51, -600.05, 43.8], 0.2, 0.4, { heading: 307.24, minZ: 43.8, maxZ: 44.4 }),
        upTo: [],
        downTo: [ElevatorFloorName.baun0],
        spawnPoint: [-1379.1, -598.67, 43.8, 109.24],
    },
    // Casino
    [ElevatorFloorName.casino0]: {
        label: 'Coffre',
        button: new BoxZone([950.58, 55.48, 60.67], 0.2, 0.4, {
            heading: 237.68,
            minZ: 59.67,
            maxZ: 60.32,
        }),
        upTo: [ElevatorFloorName.casino1, ElevatorFloorName.casino2],
        downTo: [],
        spawnPoint: [949.7, 57.2, 59.88, 235.96],
    },
    [ElevatorFloorName.casino1]: {
        label: 'Poste Sécurité',
        button: new BoxZone([967.01, 16.05, 71.84], 0.25, 1.8, {
            heading: 238.15,
            minZ: 70.84,
            maxZ: 73.19,
        }),
        upTo: [ElevatorFloorName.casino2],
        downTo: [ElevatorFloorName.casino0],
        spawnPoint: [967.82, 15.8, 71.84, 232.8],
    },
    [ElevatorFloorName.casino2]: {
        label: 'Chambres',
        button: new BoxZone([976.39, 32.35, 92.24], 0.1, 0.4, {
            heading: 147.92,
            minZ: 91.24,
            maxZ: 91.89,
        }),
        upTo: [],
        downTo: [ElevatorFloorName.casino0, ElevatorFloorName.casino1],
        spawnPoint: [974.99, 31.84, 91.44, 331.51],
    },
    // Casino VIP
    [ElevatorFloorName.casinoVip0]: {
        label: 'Garage',
        button: new BoxZone([967.61, 7.34, 81.16], 0.4, 1.8, { heading: 58.12, minZ: 80.16, maxZ: 82.56 }),
        upTo: [ElevatorFloorName.casinoVip1],
        downTo: [],
        spawnPoint: [966.49, 7.88, 81.16, 50.74],
        requireCasinoVip: true,
    },
    [ElevatorFloorName.casinoVip1]: {
        label: 'Rooftop',
        button: new BoxZone([965.18, 58.26, 112.55], 0.4, 2.2, { heading: 57.79, minZ: 111.55, maxZ: 114.15 }),
        upTo: [],
        downTo: [ElevatorFloorName.casinoVip0],
        spawnPoint: [964.58, 58.81, 112.55, 52.4],
        requireCasinoVip: true,
    },
    // Casino penthouse
    [ElevatorFloorName.casinoPenthouse0]: {
        label: 'Bureau',
        button: new BoxZone([953.11, 58.49, 75.43], 0.4, 1.8, { heading: 238.25, minZ: 74.43, maxZ: 76.78 }),
        upTo: [ElevatorFloorName.casinoPenthouse1],
        downTo: [],
        spawnPoint: [954.11, 57.95, 75.43, 298.52],
    },
    [ElevatorFloorName.casinoPenthouse1]: {
        label: 'Penthouse',
        button: new BoxZone([982.37, 55.61, 116.26], 1.8, 3.6, { heading: 237.8, minZ: 115.26, maxZ: 117.41 }),
        upTo: [],
        downTo: [ElevatorFloorName.casinoPenthouse0],
        spawnPoint: [982.37, 55.61, 116.16, 57.8],
    },
};

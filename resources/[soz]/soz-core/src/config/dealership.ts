import { WeaponName } from '@public/shared/weapons/weapon';

import { BoxZone } from '../shared/polyzone/box.zone';
import { Vector3, Vector4 } from '../shared/polyzone/vector';

export enum DealershipType {
    Pdm = 'pdm',
    Cycle = 'cycle',
    Moto = 'moto',
    Air = 'air',
    Boat = 'boat',
    Job = 'job',
    Luxury = 'luxury',
    Electric = 'electric',
}

export type DealershipConfigItem = {
    position: Vector4;
    blip: {
        name: string;
        color: number;
        sprite: number;
    };
    ped: string;
    task?: string;
    showroom: {
        position: Vector4;
        camera: Vector3;
    };
    daysBeforeNextPurchase?: number;
    garageName: string;
};

export const DealershipJob = {
    position: [858.72, -3204.44, 4.99, 180.0] as Vector4,
    parkingPlaces: [
        new BoxZone([827.31, -3210.51, 5.9], 8, 6, {
            heading: 180,
            minZ: 4.9,
            maxZ: 8.9,
            data: {
                indexGarage: 'business_dealership',
                vehicleTypes: { car: true, bike: true, motorcycle: true, truck: true },
            },
        }),
        new BoxZone([834.94, -3210.88, 5.9], 8, 6, {
            heading: 180,
            minZ: 4.9,
            maxZ: 8.9,
            data: {
                indexGarage: 'business_dealership',
                vehicleTypes: { car: true, bike: true, motorcycle: true, truck: true },
            },
        }),
        new BoxZone([807.41, -3208.19, 5.9], 12.8, 10.4, {
            heading: 46,
            minZ: 4.9,
            maxZ: 9.9,
            data: { indexGarage: 'business_dealership', vehicleTypes: { heli: true } },
        }),
    ],
    blip: {
        name: 'Concessionnaire Entreprise',
        sprite: 821,
    },
    ped: 's_f_m_shop_high',
};

export const DealershipConfig: Partial<Record<DealershipType, DealershipConfigItem>> = {
    [DealershipType.Pdm]: {
        position: [-56.61, -1096.58, 25.42, 30.0],
        blip: {
            name: 'Concessionnaire Auto',
            sprite: 225,
            color: 46,
        },
        ped: 's_m_m_autoshop_01',
        showroom: {
            position: [-46.64, -1097.53, 25.44, 26.42],
            camera: [-53.69, -1094.83, 27.0],
        },
        //daysBeforeNextPurchase: 7,
        garageName: 'bell_farms',
    },
    [DealershipType.Cycle]: {
        position: [-1222.26, -1494.83, 3.34, 120.0],
        blip: {
            name: 'Concessionnaire Vélo',
            sprite: 559,
            color: 46,
        },
        ped: 's_m_m_autoshop_01',
        showroom: {
            position: [-1221.96, -1498.45, 4.35, 210.0],
            camera: [-1222.6, -1501.34, 5.37],
        },
        garageName: 'bell_farms',
    },
    [DealershipType.Moto]: {
        position: [1224.79, 2727.25, 37.0, 180.0],
        blip: {
            name: 'Concessionnaire Moto',
            sprite: 522,
            color: 46,
        },
        ped: 's_m_m_autoshop_01',
        showroom: {
            position: [1224.66, 2706.15, 38.01, 120.0],
            camera: [1224.5, 2701.63, 39.0],
        },
        //daysBeforeNextPurchase: 7,
        garageName: 'bell_farms',
    },
    [DealershipType.Air]: {
        position: [1743.13, 3307.23, 40.22, 148.91],
        blip: {
            name: 'Concessionnaire Hélicoptère',
            sprite: 64,
            color: 46,
        },
        ped: 's_m_m_autoshop_02',
        showroom: {
            position: [1730.47, 3314.38, 40.22, 153.64],
            camera: [1733.07, 3303.82, 42.22],
        },
        //daysBeforeNextPurchase: 7,
        garageName: 'sandy_shores_air',
    },
    [DealershipType.Boat]: {
        position: [-140.49, -2718.59, 5.07, 1.43],
        blip: {
            name: 'Concessionnaire Maritime',
            sprite: 780,
            color: 46,
        },
        ped: 'mp_m_boatstaff_01',
        showroom: {
            position: [-128.36, -2729.54, 0.58, 136.81],
            camera: [-144.22, -2721.76, 6.09],
        },
        //daysBeforeNextPurchase: 7,
        garageName: 'docks_boat',
        task: 'WORLD_HUMAN_SMOKING',
    },
    [DealershipType.Electric]: {
        position: [-63.2, 71.92, 71.0, 147.57],
        blip: {
            name: 'Concessionnaire Electrique',
            sprite: 596,
            color: 46,
        },
        ped: 's_m_m_autoshop_01',
        showroom: {
            position: [-71.42, 70.37, 71.97, 324.87],
            camera: [-71.09, 76.8, 72.68],
        },
        //daysBeforeNextPurchase: 7,
        garageName: 'bell_farms',
    },
};

export const AuctionZones = [
    {
        position: [-790.36, -236.13, 36.73, 169.0],
        window: new BoxZone([-794.13, -237.8, 37.06], 7.8, 1.2, {
            heading: 30,
            minZ: 36.46,
            maxZ: 39.66,
        }),
    },
    {
        position: [-786.35, -243.06, 36.73, 72.89],
        window: new BoxZone([-790.19, -244.75, 37.08], 6.0, 1.2, {
            heading: 30,
            minZ: 36.48,
            maxZ: 39.68,
        }),
    },
];

export const luxuryStaticGuard = [
    {
        model: 's_m_m_armoured_02',
        invincible: true,
        freeze: true,
        blockevents: true,
        coords: {
            x: -779.65,
            y: -246.56,
            z: 36.058,
            w: 209.22,
        },
        animDict: 'anim@heists@heist_corona@single_team',
        anim: 'single_team_loop_boss',
        animprops: [
            {
                bone: 24816,
                model: 'w_sb_smg',
                position: [0.173, -0.18, 0.05] as Vector3,
                rotation: [10, 45, 10] as Vector3,
            },
        ],
    },
    {
        model: 's_m_m_armoured_01',
        invincible: true,
        freeze: true,
        blockevents: true,
        coords: {
            x: -788.39,
            y: -249.7,
            z: 36.056,
            w: 161.58,
        },
        animDict: 'anim@heists@heist_corona@single_team',
        anim: 'single_team_loop_boss',
        animprops: [
            {
                bone: 24816,
                model: 'w_sb_smg',
                position: [0.173, -0.18, 0.05] as Vector3,
                rotation: [10, 45, 10] as Vector3,
            },
        ],
    },
    {
        model: 's_m_m_armoured_02',
        invincible: true,
        freeze: true,
        blockevents: true,
        coords: {
            x: -797.95,
            y: -234.86,
            z: 36.132,
            w: 123.3,
        },
        animDict: 'anim@heists@heist_corona@single_team',
        anim: 'single_team_loop_boss',
        animprops: [
            {
                bone: 24816,
                model: 'w_sb_smg',
                position: [0.173, -0.18, 0.05] as Vector3,
                rotation: [10, 45, 10] as Vector3,
            },
        ],
    },
];

export const luxuryFightingGuard = {
    possiblePedModel: ['s_m_m_armoured_01', 's_m_m_armoured_02'],
    possibleSpawnPosition: [
        {
            x: -802.98,
            y: -223.93,
            z: 36.132,
            w: 160.49,
        },
        {
            x: -776.36,
            y: -245.28,
            z: 36.058,
            w: 127.82,
        },
    ],
    possibleWeapon: [WeaponName.SMG_MK2],
    detectionZoneCenter: [-789.22, -244.73, 37.0] as Vector3,
    triggerDistance: 30,
    triggerTime: 4, //seconds
};

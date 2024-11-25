import { Ped } from '@public/client/factory/ped.factory';

import { JobType } from '../job';
import { DUTY_OUTFIT_NAME, LsmcCloakroom } from '../job/lsmc';
import { DUTY_OUTFIT_NAME as PoliceOutfit, MOTO, POLICE_CLOAKROOM, SASP_DARK } from '../job/police';
import { DUTY_OUTFIT_NAME as StkOutfit, StonkCloakroom } from '../job/stonk';
import { PlayerPedHash } from '../player';
import { toVector4Object, Vector3 } from '../polyzone/vector';
import { VehicleConfiguration } from '../vehicle/modification';

export const Spotlights: Vector3[] = [
    [-549.32, -660.95, 74.28],
    [-592.96, -658.42, 66.87],
    [-486.78, -658.26, 61.51],
];

function carryFlag(model: string): Partial<Ped> {
    return {
        animDict: 'amb@world_human_drinking@coffee@male@base',
        anim: 'base',
        flag: 49,
        animprops: [
            {
                bone: 57005,
                model: model,
                position: [0.75, 2.0, 0.3],
                rotation: [280.0, 40.0, 350.0],
            },
            {
                bone: 57005,
                model: 'prop_facgate_02pole',
                position: [0.0, -0.5, -0.1],
                rotation: [280.0, 40.0, 350.0],
            },
        ],
    };
}

export const Parade: {
    start: Vector3;
    end: Vector3;
    blocks: {
        delay: number;
        pedConfig: Ped[];
        peds: {
            offsetY: number;
            peds: {
                offsetX: number;
                config: number;
                car?: string;
                carConfig?: Partial<VehicleConfiguration>;
                boat?: string;
                boatConfig?: Partial<VehicleConfiguration>;
                boatOffset?: Vector3;
            }[];
        }[];
    }[];
} = {
    start: [-657.14, -658.99, 31.72],
    end: [-413.73, -658.06, 30.29],
    blocks: [
        {
            delay: 0,
            pedConfig: [
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Female][PoliceOutfit],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Male][PoliceOutfit],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Male][MOTO],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Male]['Tenue de pilote'],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Female][PoliceOutfit],
                    ...carryFlag('prop_flag_sapd'),
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Male][PoliceOutfit],
                    ...carryFlag('prop_flag_sapd'),
                },
            ],
            peds: [
                {
                    offsetY: 0,
                    peds: [{ offsetX: 0, config: 1 }],
                },
                {
                    offsetY: 2,
                    peds: [
                        { offsetX: -2, config: 4 },
                        { offsetX: 2, config: 5 },
                    ],
                },
                {
                    offsetY: 4,
                    peds: [
                        { offsetX: -8, config: 0 },
                        { offsetX: -6, config: 1 },
                        { offsetX: -4, config: 1 },
                        { offsetX: -2, config: 0 },
                        { offsetX: 0, config: 0 },
                        { offsetX: 2, config: 0 },
                        { offsetX: 4, config: 1 },
                        { offsetX: 6, config: 1 },
                        { offsetX: 8, config: 1 },
                    ],
                },
                {
                    offsetY: 3,
                    peds: [
                        { offsetX: -8, config: 1 },
                        { offsetX: -6, config: 1 },
                        { offsetX: -4, config: 0 },
                        { offsetX: -2, config: 0 },
                        { offsetX: 0, config: 1 },
                        { offsetX: 2, config: 0 },
                        { offsetX: 4, config: 0 },
                        { offsetX: 6, config: 1 },
                        { offsetX: 8, config: 0 },
                    ],
                },
                {
                    offsetY: 3,
                    peds: [
                        { offsetX: -8, config: 1 },
                        { offsetX: -6, config: 0 },
                        { offsetX: -4, config: 0 },
                        { offsetX: -2, config: 1 },
                        { offsetX: 0, config: 1 },
                        { offsetX: 2, config: 0 },
                        { offsetX: 4, config: 0 },
                        { offsetX: 6, config: 0 },
                        { offsetX: 8, config: 1 },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'lspd11',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 0,
                            car: 'lspd10',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'lspd12',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'lspd21',
                            carConfig: {
                                color: { pearlescent: 0, primary: 0, rim: 0, secondary: 134 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 2,
                            car: 'lspd30',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'lspd20',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'lspd40',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 3,
                            car: 'polmav',
                            carConfig: {
                                livery: 0,
                            },
                        },
                        {
                            offsetX: 0,
                            config: 0,
                            car: 'phantom',
                            boat: 'predator',
                            boatConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'lspd41',
                            carConfig: {
                                color: { pearlescent: 0, primary: 0, rim: 0, secondary: 134 },
                            },
                        },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'lspd50',
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'lspd51',
                        },
                    ],
                },
            ],
        },
        {
            delay: 60_000,
            pedConfig: [
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Male][PoliceOutfit],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Female][PoliceOutfit],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Female][MOTO],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Female]['Tenue de pilote'],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Male][PoliceOutfit],
                    ...carryFlag('prop_flag_sheriff'),
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Female][PoliceOutfit],
                    ...carryFlag('prop_flag_sheriff'),
                },
            ],
            peds: [
                {
                    offsetY: 0,
                    peds: [{ offsetX: 0, config: 1 }],
                },
                {
                    offsetY: 2,
                    peds: [
                        { offsetX: -2, config: 4 },
                        { offsetX: 2, config: 5 },
                    ],
                },
                {
                    offsetY: 4,
                    peds: [
                        { offsetX: -8, config: 0 },
                        { offsetX: -6, config: 1 },
                        { offsetX: -4, config: 1 },
                        { offsetX: -2, config: 0 },
                        { offsetX: 0, config: 0 },
                        { offsetX: 2, config: 0 },
                        { offsetX: 4, config: 1 },
                        { offsetX: 6, config: 1 },
                        { offsetX: 8, config: 1 },
                    ],
                },
                {
                    offsetY: 3,
                    peds: [
                        { offsetX: -8, config: 1 },
                        { offsetX: -6, config: 1 },
                        { offsetX: -4, config: 0 },
                        { offsetX: -2, config: 0 },
                        { offsetX: 0, config: 1 },
                        { offsetX: 2, config: 0 },
                        { offsetX: 4, config: 0 },
                        { offsetX: 6, config: 1 },
                        { offsetX: 8, config: 0 },
                    ],
                },
                {
                    offsetY: 3,
                    peds: [
                        { offsetX: -8, config: 1 },
                        { offsetX: -6, config: 0 },
                        { offsetX: -4, config: 0 },
                        { offsetX: -2, config: 1 },
                        { offsetX: 0, config: 1 },
                        { offsetX: 2, config: 0 },
                        { offsetX: 4, config: 0 },
                        { offsetX: 6, config: 0 },
                        { offsetX: 8, config: 1 },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'bcso11',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 0,
                            car: 'bcso10',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'bcso12',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'bcso21',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 2,
                            car: 'bcso30',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'bcso20',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'bcso40',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 0,
                            car: 'maverick2',
                            carConfig: {
                                livery: 1,
                            },
                        },
                        {
                            offsetX: 0,
                            config: 0,
                            car: 'phantom',
                            boat: 'predator',
                            boatConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'bcso41',
                            carConfig: {
                                color: { pearlescent: 0, primary: 0, rim: 0, secondary: 134 },
                            },
                        },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'bcso50',
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'bcso51',
                        },
                    ],
                },
            ],
        },
        {
            delay: 60_000,
            pedConfig: [
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.SASP][PlayerPedHash.Male][PoliceOutfit],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.SASP][PlayerPedHash.Female][PoliceOutfit],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.SASP][PlayerPedHash.Male][SASP_DARK],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.SASP][PlayerPedHash.Female][SASP_DARK],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.SASP][PlayerPedHash.Male][PoliceOutfit],
                    ...carryFlag('prop_flag_sa'),
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: POLICE_CLOAKROOM[JobType.SASP][PlayerPedHash.Female][PoliceOutfit],
                    ...carryFlag('prop_flag_sa'),
                },
            ],
            peds: [
                {
                    offsetY: 0,
                    peds: [{ offsetX: 0, config: 2 }],
                },
                {
                    offsetY: 2,
                    peds: [
                        { offsetX: -2, config: 4 },
                        { offsetX: 2, config: 5 },
                    ],
                },
                {
                    offsetY: 4,
                    peds: [
                        { offsetX: -8, config: 2 },
                        { offsetX: -6, config: 2 },
                        { offsetX: -4, config: 3 },
                        { offsetX: -2, config: 2 },
                        { offsetX: 0, config: 3 },
                        { offsetX: 2, config: 3 },
                        { offsetX: 4, config: 3 },
                        { offsetX: 6, config: 2 },
                        { offsetX: 8, config: 2 },
                    ],
                },
                {
                    offsetY: 3,
                    peds: [
                        { offsetX: -8, config: 1 },
                        { offsetX: -6, config: 0 },
                        { offsetX: -4, config: 0 },
                        { offsetX: -2, config: 1 },
                        { offsetX: 0, config: 1 },
                        { offsetX: 2, config: 1 },
                        { offsetX: 4, config: 0 },
                        { offsetX: 6, config: 0 },
                        { offsetX: 8, config: 0 },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'sasp1',
                            carConfig: {
                                color: { pearlescent: 0, primary: 14, rim: 0, secondary: 0 },
                                livery: 0,
                            },
                        },
                        {
                            offsetX: 0,
                            config: 1,
                            car: 'sasp1',
                            carConfig: {
                                color: { pearlescent: 0, primary: 14, rim: 0, secondary: 0 },
                                livery: 0,
                            },
                        },
                        {
                            offsetX: 8,
                            config: 1,
                            car: 'sasp1',
                            carConfig: {
                                color: { pearlescent: 0, primary: 14, rim: 0, secondary: 0 },
                                livery: 0,
                            },
                        },
                    ],
                },
            ],
        },

        {
            delay: 40_000,
            pedConfig: [
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: LsmcCloakroom[PlayerPedHash.Male][DUTY_OUTFIT_NAME],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: LsmcCloakroom[PlayerPedHash.Female][DUTY_OUTFIT_NAME],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: LsmcCloakroom[PlayerPedHash.Male]['Tenue incendie'],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: LsmcCloakroom[PlayerPedHash.Female]['Tenue incendie'],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: LsmcCloakroom[PlayerPedHash.Male]['Sauveteur en mer'],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: LsmcCloakroom[PlayerPedHash.Female]['Sauveteur en mer'],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: LsmcCloakroom[PlayerPedHash.Male][DUTY_OUTFIT_NAME],
                    ...carryFlag('prop_flag_lsfd'),
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: LsmcCloakroom[PlayerPedHash.Female][DUTY_OUTFIT_NAME],
                    ...carryFlag('prop_flag_lsfd'),
                },
            ],
            peds: [
                {
                    offsetY: 0,
                    peds: [{ offsetX: 0, config: 1 }],
                },
                {
                    offsetY: 2,
                    peds: [
                        { offsetX: -2, config: 6 },
                        { offsetX: 2, config: 7 },
                    ],
                },
                {
                    offsetY: 4,
                    peds: [
                        { offsetX: -8, config: 0 },
                        { offsetX: -6, config: 0 },
                        { offsetX: -4, config: 1 },
                        { offsetX: -2, config: 1 },
                        { offsetX: 0, config: 0 },
                        { offsetX: 2, config: 0 },
                        { offsetX: 4, config: 1 },
                        { offsetX: 6, config: 1 },
                        { offsetX: 8, config: 0 },
                    ],
                },
                {
                    offsetY: 3,
                    peds: [
                        { offsetX: -8, config: 1 },
                        { offsetX: -6, config: 0 },
                        { offsetX: -4, config: 0 },
                        { offsetX: -2, config: 1 },
                        { offsetX: 0, config: 1 },
                        { offsetX: 2, config: 1 },
                        { offsetX: 4, config: 0 },
                        { offsetX: 6, config: 0 },
                        { offsetX: 8, config: 0 },
                    ],
                },
                {
                    offsetY: 3,
                    peds: [
                        { offsetX: -8, config: 2 },
                        { offsetX: -6, config: 3 },
                        { offsetX: -4, config: 3 },
                        { offsetX: -2, config: 2 },
                        { offsetX: 0, config: 3 },
                        { offsetX: 2, config: 3 },
                        { offsetX: 4, config: 2 },
                        { offsetX: 6, config: 2 },
                        { offsetX: 8, config: 3 },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'ambulance2',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 0,
                            car: 'ambcar',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 1,
                            car: 'ambulance2',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 4,
                            car: 'blazer2',
                            carConfig: {
                                color: { pearlescent: 0, primary: 0, rim: 0, secondary: 134 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 0,
                            car: 'lguard',
                        },
                        {
                            offsetX: 8,
                            config: 5,
                            car: 'blazer2',
                            carConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'phantom',
                            boat: 'seashark2',
                            boatOffset: [0, 0, 0.5],
                            boatConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 0,
                            config: 1,
                            car: 'polmav',
                            carConfig: {
                                livery: 1,
                            },
                        },
                        {
                            offsetX: 0,
                            config: 3,
                            car: 'firetruk',
                            carConfig: {
                                livery: 1,
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 0,
                            car: 'phantom',
                            boat: 'dinghy3',
                            boatConfig: {
                                color: { pearlescent: 0, primary: 134, rim: 0, secondary: 0 },
                            },
                        },
                    ],
                },
            ],
        },
        {
            delay: 60_000,
            pedConfig: [
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: StonkCloakroom[PlayerPedHash.Male][StkOutfit],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: StonkCloakroom[PlayerPedHash.Female][StkOutfit],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: StonkCloakroom[PlayerPedHash.Male]['Tenue VIP'],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: StonkCloakroom[PlayerPedHash.Female]['Tenue VIP'],
                },
                {
                    model: 'mp_m_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: StonkCloakroom[PlayerPedHash.Male]['Tenue Direction'],
                },
                {
                    model: 'mp_f_freemode_01',
                    coords: toVector4Object([0, 0, 0, 0]),
                    outfit: StonkCloakroom[PlayerPedHash.Female]['Tenue Direction'],
                },
            ],
            peds: [
                {
                    offsetY: 0,
                    peds: [{ offsetX: 0, config: 4 }],
                },
                {
                    offsetY: 2,
                    peds: [
                        { offsetX: -2, config: 2 },
                        { offsetX: 2, config: 3 },
                    ],
                },
                {
                    offsetY: 4,
                    peds: [
                        { offsetX: -8, config: 0 },
                        { offsetX: -6, config: 1 },
                        { offsetX: -4, config: 1 },
                        { offsetX: -2, config: 0 },
                        { offsetX: 0, config: 0 },
                        { offsetX: 2, config: 0 },
                        { offsetX: 4, config: 1 },
                        { offsetX: 6, config: 0 },
                        { offsetX: 8, config: 1 },
                    ],
                },
                {
                    offsetY: 3,
                    peds: [
                        { offsetX: -8, config: 1 },
                        { offsetX: -6, config: 0 },
                        { offsetX: -4, config: 0 },
                        { offsetX: -2, config: 1 },
                        { offsetX: 0, config: 1 },
                        { offsetX: 2, config: 1 },
                        { offsetX: 4, config: 0 },
                        { offsetX: 6, config: 0 },
                        { offsetX: 8, config: 0 },
                    ],
                },

                {
                    offsetY: 15,
                    peds: [
                        {
                            offsetX: -8,
                            config: 0,
                            car: 'baller9',
                            carConfig: {
                                color: { pearlescent: 0, primary: 112, rim: 0, secondary: 0 },
                                livery: 1,
                            },
                        },
                        {
                            offsetX: 0,
                            config: 1,
                            car: 'stockade',
                            carConfig: {
                                color: { pearlescent: 0, primary: 111, rim: 0, secondary: 125 },
                            },
                        },
                        {
                            offsetX: 8,
                            config: 1,
                            car: 'baller9',
                            carConfig: {
                                color: { pearlescent: 0, primary: 112, rim: 0, secondary: 0 },
                                livery: 1,
                            },
                        },
                    ],
                },
            ],
        },
    ],
};

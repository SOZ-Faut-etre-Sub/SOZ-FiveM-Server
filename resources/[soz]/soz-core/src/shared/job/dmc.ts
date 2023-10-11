import { WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
import { Field } from '../field';
import { JobType } from '../job';
import { BoxZone, NamedZone } from '../polyzone/box.zone';

export type DmcConverterRecipe = {
    input: Record<string, number>;
    outputAmount: number;
    temperature: number;
};

export type DmcConverterState = {
    enabled: boolean;
    temperature: number;
    targetTemperature: number;
};

export type DmcJobMenuData = {
    onDuty: boolean;
    blipState: {
        'job:dmc:iron_mine': boolean;
        'job:dmc:aluminium_mine': boolean;
        'job:dmc:resell': boolean;
    };
};

const DmcConverterRecipes: Record<string, DmcConverterRecipe> = {
    ['iron_ingot']: {
        input: {
            ['raw_iron']: 10,
            ['raw_coal']: 20,
        },
        outputAmount: 2,
        temperature: 1538,
    },
    ['aluminium_ingot']: {
        input: {
            ['raw_aluminium']: 10,
            ['raw_coal']: 20,
        },
        outputAmount: 2,
        temperature: 660,
    },
    ['steel_ingot']: {
        input: {
            ['raw_iron']: 10,
            ['raw_coal']: 40,
        },
        outputAmount: 2,
        temperature: 1250,
    },
};

export const DmcConverterConfig = {
    converterStorage: 'dmc_converter',
    converterDelay: 10000, // in ms
    energyPerTick: 0.25, // 10s -> 0.025% <=> 1h -> 9% energy
    recipes: DmcConverterRecipes,
};

export const DmcIncineratorConfig = {
    incineratorStorage: 'dmc_incinerator',
    incineratorDelay: 60000, // in ms
    incineratorProcessingAmount: 100,
};

export const DmcResellconfig = {
    resell_item: 'ls_custom_upgrade_part',
    resell_price: 500,
};

export const DMC_FIELDS_ZONES: Record<string, BoxZone[]> = {
    ['dmc_aluminium_field']: [
        new BoxZone([2921.42, 2799.32, 41.07], 2.6, 3.4, {
            heading: 275.51,
            minZ: 40.07,
            maxZ: 41.67,
        }),
        new BoxZone([2925.75, 2794.06, 40.08], 2.6, 6.2, {
            heading: 277.19,
            minZ: 39.28,
            maxZ: 41.08,
        }),
        new BoxZone([2929.24, 2788.62, 39.39], 3.2, 6.8, {
            heading: 309.39,
            minZ: 38.39,
            maxZ: 39.99,
        }),
        new BoxZone([2938.72, 2771.83, 39.28], 4.2, 7.6, {
            heading: 283.52,
            minZ: 38.28,
            maxZ: 40.28,
        }),
        new BoxZone([2950.67, 2767.58, 39.01], 4.2, 9.8, {
            heading: 30.19,
            minZ: 38.01,
            maxZ: 40.01,
        }),
        new BoxZone([2968.64, 2774.68, 37.55], 4.0, 10.6, {
            heading: 13.84,
            minZ: 36.55,
            maxZ: 39.35,
        }),
        new BoxZone([2977.3, 2793.14, 40.18], 4.0, 8.2, {
            heading: 118.58,
            minZ: 39.18,
            maxZ: 41.18,
        }),
        new BoxZone([2937.75, 2813.51, 42.34], 4.0, 2.8, {
            heading: 215.67,
            minZ: 41.54,
            maxZ: 43.34,
        }),
        new BoxZone([2946.32, 2819.9, 42.5], 4.2, 6.6, {
            heading: 191.63,
            minZ: 41.5,
            maxZ: 43.5,
        }),
    ],
    ['dmc_iron_field']: [
        new BoxZone([-541.01, 1970.27, 126.65], 1.6, 21.8, {
            heading: 98.46,
            minZ: 125.65,
            maxZ: 129.25,
        }),
        new BoxZone([-544.59, 1971.01, 126.79], 2.2, 21.2, {
            heading: 277.94,
            minZ: 125.59,
            maxZ: 129.19,
        }),
        new BoxZone([-530.37, 1982.11, 126.8], 1.4, 14.8, {
            heading: 170.73,
            minZ: 125.6,
            maxZ: 129.2,
        }),
        new BoxZone([-528.72, 1978.81, 126.73], 1.6, 25.6, {
            heading: 352.84,
            minZ: 125.73,
            maxZ: 129.13,
        }),
    ],
};

// 20 minutes to harvest full field
// 1 hour to refill full field
export const DMC_FIELDS: Record<string, Field> = {
    ['dmc_iron_field']: {
        identifier: 'dmc_iron_field',
        owner: JobType.DMC,
        item: [
            {
                name: 'raw_iron',
                amount: 2,
            },
            {
                name: 'raw_coal',
                amount: 6,
            },
        ],
        capacity: 240,
        maxCapacity: 240,
        refill: {
            delay: 5 * 60 * 1000,
            amount: 20,
        },
        harvest: {
            delay: 0,
            amount: 1,
        },
    },
    ['dmc_aluminium_field']: {
        identifier: 'dmc_aluminium_field',
        owner: JobType.DMC,
        item: [
            {
                name: 'raw_aluminium',
                amount: 2,
            },
        ],
        capacity: 240,
        maxCapacity: 240,
        refill: {
            delay: 5 * 60 * 1000,
            amount: 20,
        },
        harvest: {
            delay: 0,
            amount: 1,
        },
    },
};

// Craft zones
export const DMC_CRAFT_ZONES: NamedZone[] = [
    {
        ...new BoxZone([1117.15, -1997.82, 35.44], 1.0, 3.4, {
            heading: 244.3,
            minZ: 34.44,
            maxZ: 35.64,
        }),
        name: 'dmc:craft_1',
    },
    {
        ...new BoxZone([1121.2, -1997.12, 35.34], 1.2, 3.4, {
            heading: 67.6,
            minZ: 34.34,
            maxZ: 35.54,
        }),
        name: 'dmc:craft_2',
    },
];

export const DmcCraftsLists: Record<string, CraftCategory> = {
    'Caisses de Metaux': {
        animation: {
            dictionary: 'melee@small_wpn@streamed_core_fps',
            name: 'car_down_attack',
            options: {
                repeat: true,
            },
        },
        duration: 30000,
        icon: '📦',
        event: 'job_dmc_craft',
        recipes: {
            resell_box_coal: {
                inputs: {
                    raw_coal: { count: 180 },
                },
                amount: 1,
            },
            resell_box_iron: {
                inputs: {
                    iron_ingot: { count: 12 },
                },
                amount: 1,
            },
            resell_box_aluminium: {
                inputs: {
                    aluminium_ingot: { count: 12 },
                },
                amount: 1,
            },
            resell_box_steel: {
                inputs: {
                    steel_ingot: { count: 12 },
                },
                amount: 1,
            },
        },
    },
    'Pièces de Véhicule': {
        animation: {
            dictionary: 'melee@small_wpn@streamed_core_fps',
            name: 'car_down_attack',
            options: {
                repeat: true,
            },
        },
        duration: 10000,
        icon: '🔧',
        event: 'job_dmc_craft',
        recipes: {
            repair_part_body: {
                inputs: {
                    iron_ingot: { count: 1 },
                    aluminium_ingot: { count: 1 },
                },
                amount: 10,
            },
            repair_part_motor: {
                inputs: {
                    iron_ingot: { count: 1 },
                    steel_ingot: { count: 1 },
                },
                amount: 10,
            },
            repair_part_fuel_tank: {
                inputs: {
                    aluminium_ingot: { count: 1 },
                    steel_ingot: { count: 1 },
                },
                amount: 10,
            },
            ls_custom_upgrade_part: {
                inputs: {
                    aluminium_ingot: { count: 1 },
                    iron_ingot: { count: 1 },
                    steel_ingot: { count: 1 },
                },
                amount: 10,
            },
        },
    },
    'Armes non létales': {
        animation: {
            dictionary: 'melee@small_wpn@streamed_core_fps',
            name: 'car_down_attack',
            options: {
                repeat: true,
            },
        },
        duration: 20000,
        icon: '👊',
        event: 'job_dmc_craft',
        recipes: {
            weapon_flashlight: {
                inputs: {
                    aluminium_ingot: { count: 1 },
                    weapon_certificate: {
                        count: 1,
                        metadata: { craftCertificate: 'weapon_flashlight', label: 'Lampe de poche' },
                    },
                },
                amount: 1,
            },
            weapon_nightstick: {
                inputs: {
                    iron_ingot: { count: 1 },
                    weapon_certificate: {
                        count: 1,
                        metadata: { craftCertificate: 'weapon_nightstick', label: 'Matraque' },
                    },
                },
                amount: 1,
            },
            weapon_pumpshotgun: {
                inputs: {
                    iron_ingot: { count: 2 },
                    steel_ingot: { count: 2 },
                    weapon_certificate: {
                        count: 1,
                        metadata: { craftCertificate: 'weapon_pumpshotgun', label: 'Remington 870 Non lethal' },
                    },
                },
                amount: 1,
            },
        },
    },
    'Armes à feu': {
        animation: {
            dictionary: 'melee@small_wpn@streamed_core_fps',
            name: 'car_down_attack',
            options: {
                repeat: true,
            },
        },
        duration: 60000,
        icon: '🔫',
        event: 'job_dmc_craft',
        recipes: {
            weapon_pistol_mk2: {
                inputs: {
                    aluminium_ingot: { count: 2 },
                    steel_ingot: { count: 2 },
                    weapon_certificate: {
                        count: 1,
                        metadata: { craftCertificate: 'weapon_pistol_mk2', label: 'Pistolet Mk II' },
                    },
                },
                amount: 1,
            },
            weapon_revolver_mk2: {
                inputs: {
                    iron_ingot: { count: 2 },
                    steel_ingot: { count: 2 },
                    weapon_certificate: {
                        count: 1,
                        metadata: { craftCertificate: 'weapon_revolver_mk2', label: 'Revolver lourd Mk II' },
                    },
                },
                amount: 1,
            },
            weapon_smg: {
                inputs: {
                    steel_ingot: { count: 3 },
                    iron_ingot: { count: 2 },
                    aluminium_ingot: { count: 3 },
                    weapon_certificate: {
                        count: 1,
                        metadata: { craftCertificate: 'weapon_smg', label: 'Mitraillette' },
                    },
                },
                amount: 1,
            },
            weapon_assaultsmg: {
                inputs: {
                    steel_ingot: { count: 3 },
                    iron_ingot: { count: 3 },
                    aluminium_ingot: { count: 2 },
                    weapon_certificate: {
                        count: 1,
                        metadata: { craftCertificate: 'weapon_assaultsmg', label: 'P90 GEN2' },
                    },
                },
                amount: 1,
            },
        },
    },
    Munitions: {
        animation: {
            dictionary: 'melee@small_wpn@streamed_core_fps',
            name: 'car_down_attack',
            options: {
                repeat: true,
            },
        },
        duration: 5000,
        icon: '🔥',
        event: 'job_dmc_craft',
        recipes: {
            ammo_01: {
                inputs: {
                    iron_ingot: { count: 1 },
                    ammo_certificate: { count: 1 },
                },
                amount: 10,
            },
            ammo_02: {
                inputs: {
                    iron_ingot: { count: 1 },
                    ammo_certificate: { count: 1 },
                },
                amount: 10,
            },
            ammo_04: {
                inputs: {
                    iron_ingot: { count: 1 },
                    ammo_certificate: { count: 1 },
                },
                amount: 10,
            },
            ammo_17: {
                inputs: {
                    aluminium_ingot: { count: 1 },
                    ammo_certificate: { count: 1 },
                },
                amount: 10,
            },
        },
    },
    Utilitaires: {
        animation: {
            dictionary: 'melee@small_wpn@streamed_core_fps',
            name: 'car_down_attack',
            options: {
                repeat: true,
            },
        },
        duration: 5000,
        icon: '👮',
        event: 'job_dmc_craft',
        recipes: {
            handcuffs: {
                inputs: {
                    aluminium_ingot: { count: 2 },
                    utilitary_certificate: { count: 1 },
                },
                amount: 5,
            },
            handcuffs_key: {
                inputs: {
                    steel_ingot: { count: 1 },
                    utilitary_certificate: { count: 1 },
                },
                amount: 5,
            },
            spike: {
                inputs: {
                    iron_ingot: { count: 5 },
                    utilitary_certificate: { count: 1 },
                },
                amount: 5,
            },
            cone: {
                inputs: {
                    aluminium_ingot: { count: 5 },
                    utilitary_certificate: { count: 1 },
                },
                amount: 5,
            },
            police_pliers: {
                inputs: {
                    aluminium_ingot: { count: 5 },
                    utilitary_certificate: { count: 1 },
                },
                amount: 5,
            },
        },
    },
};

export const DmcCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Tenue de Sidérurgie']: {
            Components: {
                '1': { Drawable: 38, Texture: 0, Palette: 0 },
                '3': { Drawable: 172, Texture: 0, Palette: 0 },
                '4': { Drawable: 84, Texture: 0, Palette: 0 },
                '5': { Drawable: 82, Texture: 0, Palette: 0 },
                '6': { Drawable: 39, Texture: 1, Palette: 0 },
                '8': { Drawable: 15, Texture: 0, Palette: 0 },
                '11': { Drawable: 186, Texture: 0, Palette: 0 },
            },
            Props: {
                '0': { Drawable: 145, Texture: 0 },
            },
        },
        ['Tenue de Mineur']: {
            Components: {
                '3': { Drawable: 195, Texture: 0, Palette: 0 },
                '4': { Drawable: 98, Texture: 3, Palette: 0 },
                '5': { Drawable: 82, Texture: 0, Palette: 0 },
                '6': { Drawable: 71, Texture: 3, Palette: 0 },
                '8': { Drawable: 15, Texture: 0, Palette: 0 },
                '11': { Drawable: 251, Texture: 3, Palette: 0 },
            },
            Props: {
                '0': { Drawable: 145, Texture: 0 },
                '1': { Drawable: 24, Texture: 1 },
            },
        },
        ['Tenue de Contremaître']: {
            Components: {
                '3': { Drawable: 172, Texture: 3, Palette: 0 },
                '4': { Drawable: 125, Texture: 4, Palette: 0 },
                '5': { Drawable: 82, Texture: 16, Palette: 0 },
                '6': { Drawable: 71, Texture: 22, Palette: 0 },
                '8': { Drawable: 15, Texture: 0, Palette: 0 },
                '11': { Drawable: 248, Texture: 18, Palette: 0 },
            },
            Props: {
                '0': { Drawable: 145, Texture: 0 },
                '1': { Drawable: 24, Texture: 1 },
            },
        },
        ['Tenue Patron']: {
            Components: {
                '3': { Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Drawable: 20, Texture: 2, Palette: 0 },
                '6': { Drawable: 51, Texture: 0, Palette: 0 },
                '8': { Drawable: 15, Texture: 0, Palette: 0 },
                '11': { Drawable: 322, Texture: 0, Palette: 0 },
            },
            Props: {
                '0': { Drawable: 145, Texture: 0 },
            },
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Tenue de Sidérurgie']: {
            Components: {
                '1': { Drawable: 38, Texture: 0, Palette: 0 },
                '3': { Drawable: 18, Texture: 0, Palette: 0 },
                '4': { Drawable: 86, Texture: 0, Palette: 0 },
                '5': { Drawable: 82, Texture: 0, Palette: 0 },
                '6': { Drawable: 25, Texture: 0, Palette: 0 },
                '8': { Drawable: 15, Texture: 0, Palette: 0 },
                '11': { Drawable: 188, Texture: 0, Palette: 0 },
            },
            Props: {
                '0': { Drawable: 144, Texture: 0 },
            },
        },
        ['Tenue de Mineur']: {
            Components: {
                '3': { Drawable: 240, Texture: 0, Palette: 0 },
                '4': { Drawable: 101, Texture: 3, Palette: 0 },
                '5': { Drawable: 82, Texture: 0, Palette: 0 },
                '6': { Drawable: 74, Texture: 3, Palette: 0 },
                '8': { Drawable: 15, Texture: 0, Palette: 0 },
                '11': { Drawable: 259, Texture: 3, Palette: 0 },
            },
            Props: {
                '0': { Drawable: 144, Texture: 0 },
                '1': { Drawable: 26, Texture: 1 },
            },
        },
        ['Tenue de Contremaître']: {
            Components: {
                '3': { Drawable: 212, Texture: 2, Palette: 0 },
                '4': { Drawable: 131, Texture: 4, Palette: 0 },
                '5': { Drawable: 82, Texture: 16, Palette: 0 },
                '6': { Drawable: 74, Texture: 2, Palette: 0 },
                '8': { Drawable: 15, Texture: 0, Palette: 0 },
                '11': { Drawable: 256, Texture: 18, Palette: 0 },
            },
            Props: {
                '0': { Drawable: 144, Texture: 0 },
                '1': { Drawable: 26, Texture: 1 },
            },
        },
        ['Tenue Patron']: {
            Components: {
                '3': { Drawable: 14, Texture: 0, Palette: 0 },
                '4': { Drawable: 23, Texture: 10, Palette: 0 },
                '6': { Drawable: 115, Texture: 0, Palette: 0 },
                '8': { Drawable: 14, Texture: 0, Palette: 0 },
                '11': { Drawable: 333, Texture: 0, Palette: 0 },
            },
            Props: {
                '0': { Drawable: 144, Texture: 0 },
            },
        },
    },
};

import { WardrobeConfig } from '@public/shared/cloth';
import { CraftCategory } from '@public/shared/craft/craft';
import { PlacementPropList } from '@public/shared/nui/prop_placement';
import { MapPickerLocation } from '@public/shared/picker';
import { PlayerPedHash } from '@public/shared/player';
import { Vector4 } from '@public/shared/polyzone/vector';

import { PolygonZone } from './polyzone/polygon.zone';

// clone of shared/inventory.ts to prevent circular dependency
type InventoryItemCreator = {
    chance: number;
    min: number;
    max: number;
};

export interface WhatIfMap {
    OpenWelcomePage: boolean;
}

export type WhatIfGuild = 'raider' | 'warden';

export const WhatIfRadiationZone = [
    new PolygonZone([
        [-3062.487602861532, 2614.3959139310036],
        [-1693.5111093099376, 2603.2586372748474],
        [-1272.5020451016062, 2670.082297211782],
        [-1071.7560012406802, 2823.219851233922],
        [-865.433678383617, 2809.298255413727],
        [-622.8655420516634, 2956.8671711077895],
        [-500.18740413665364, 2909.5337453191287],
        [-355.20415023709484, 3034.8281077008796],
        [-250.73466132572594, 3003.980387092104],
        [-131.1680672944367, 3121.546184310214],
        [14.15133160512869, 3128.8940466363447],
        [155.79175838065566, 3472.406610383009],
        [209.13685417922989, 3725.9078606345574],
        [84.05180196188212, 3858.1693825049306],
        [-96.21588321025774, 3766.3540256482593],
        [-196.94536424981106, 4086.3075870460953],
        [-28.253823713692327, 4310.517469086246],
        [485.10244712643816, 4121.4540009875245],
        [969.3321210394697, 4128.725672837475],
        [1294.5791200587491, 4212.3498991119095],
        [1678.0793129322274, 4426.864218685459],
        [2135.6096063287514, 4538.363187051371],
        [2396.5353704673525, 4588.052944692701],
        [2831.007107963256, 5015.869638531474],
        [2896.5419510492284, 5060.711614939504],
        [3187.807920320225, 5055.863833706204],
        [6102.126927289366, 5033.969267480822],
        [6000.544751620413, 8166.837129447597],
        [-5612.583564077458, 7846.098989510248],
        [-5595.6794471696, 2748.0506599797573],
    ]),
];

export const WhatIf2SpawnGuild: MapPickerLocation[] = [
    {
        id: 'raider',
        coords: [1663.61, 2519.21, 45.57],
        icon: 'location',
        description: {
            title: 'Raiders',
            description:
                'Les Raiders sont un groupe de survivants impitoyables, retranchés dans le pénitencier de Bolingbroke. Violents et imprévisibles, ils survivent en pillant, intimidant et écrasant quiconque se met sur leur chemin.',
            image: `/static/game/images/whatif/raider.webp`,
        },
    },
    {
        id: 'warden',
        coords: [2505.71, -384.81, 94.12],
        icon: 'location',
        description: {
            title: 'Wardens',
            description:
                'Les Wardens sont des survivants organisés et disciplinés, établis dans l’ancien quartier général du NOOSE. Ils incarnent l’ordre au milieu du chaos, protégeant leur zone fortifiée avec des patrouilles armées et des barricades solides.',
            image: `/static/game/images/whatif/warden.webp`,
        },
    },
];

export const WhatIf2DefaultItems = [{ name: 'cheese9', quantity: 4 }];

export const WhatIfSafeZones: Record<WhatIfGuild, PolygonZone> = {
    raider: new PolygonZone([
        [1769.5147072494347, 2398.647976934594],
        [1808.5661250783078, 2425.7904443488687],
        [1849.0122364010704, 2483.5551826920655],
        [1864.3538648338435, 2517.657257135641],
        [1904.102629409661, 2530.8805104913126],
        [1906.892016397438, 2713.918175361927],
        [1789.737762910815, 2774.4667565168447],
        [1642.5975993055927, 2770.9869530021942],
        [1551.9425222028485, 2674.944375997842],
        [1520.5619185903606, 2589.3412095374406],
        [1528.2327328067458, 2456.412715277793],
        [1646.084333040314, 2382.6408807672033],
        [1669.7941224364158, 2379.857037955482],
    ]),
    warden: new PolygonZone([
        [2507.4819626008793, -497.68165070627947],
        [2544.2993644101625, -481.2880739932625],
        [2587.9138250150027, -421.932020377164],
        [2588.480246581299, -313.9605323707401],
        [2588.480246581299, -266.47568947786203],
        [2532.4045115179324, -241.0373807852484],
        [2488.7900509130905, -242.16797228269752],
        [2451.972649103809, -276.0857172061824],
        [2416.854511993419, -325.26644734523506],
        [2411.190296330452, -378.4042477253588],
        [2423.6515707889776, -419.67083738226574],
    ]),
};

export const WhatIf2ShopPosition: Vector4[] = [
    [1663.61, 2519.21, 44.57, 0], // raider
    [2504.67, -397.82, 93.12, 349.58], // warden
];

export const WhatIf2ShopItems = [{ name: 'tapas_777', price: 1 }];

export const WhatIf2HammerZoneConfig = {
    prefix: 'whatif_',
    item: 'whatif_parts',
    price: 5,
};

export enum WhatIf2LootType {
    Low,
    Medium,
    High,
    Military,
}

export const WhatIf2LootInventoryType: Record<WhatIf2LootType, string> = {
    [WhatIf2LootType.Low]: 'what_if_loot_low',
    [WhatIf2LootType.Medium]: 'what_if_loot_medium',
    [WhatIf2LootType.High]: 'what_if_loot_high',
    [WhatIf2LootType.Military]: 'what_if_loot_military',
};

export const WhatIf2LootModels: Record<WhatIf2LootType, string[]> = {
    [WhatIf2LootType.Low]: [],
    [WhatIf2LootType.Medium]: [],
    [WhatIf2LootType.High]: [],
    [WhatIf2LootType.Military]: [],
};

export const WhatIf2LootInventoryContent: Partial<Record<string, Record<string, InventoryItemCreator>>> = {
    zombie: {
        phone: {
            chance: 100,
            min: 1,
            max: 1,
        },
    },
    huge_stash: {},
    what_if_loot_low: {
        water_bottle: {
            chance: 100,
            min: 1,
            max: 1,
        },
    },
    what_if_loot_medium: {},
    what_if_loot_high: {},
};

export const WhatIf2RespawnPoints: Record<WhatIfGuild, Vector4[]> = {
    raider: [
        [1863.13, 2584.33, 45.67, 234.68],
        [1873.92, 2641.81, 45.67, 13.28],
        [1703.04, 2529.76, 45.56, 277.15],
        [1677.12, 2511.1, 45.56, 250.53],
        [1749.52, 2509.75, 45.55, 18.82],
        [1718.44, 2555.7, 45.56, 227.13],
        [1763.89, 2560.23, 45.56, 136.58],
        [1765.59, 2533.3, 45.56, 70.55],
        [1856.62, 2610.18, 45.67, 267.25],
    ],
    warden: [
        [2574.04, -373.64, 92.99, 0],
        [2567.44, -384.16, 92.99, 156.91],
        [2555.26, -404.91, 93.04, 70.07],
        [2553.58, -439.94, 92.95, 127.07],
        [2538.6, -461.17, 93.03, 142.17],
        [2507.14, -469.54, 92.95, 286.83],
        [2536.16, -424.12, 94.11, 343.88],
        [2505.85, -391.94, 94.13, 316.56],
        [2508.66, -370.29, 94.12, 274.57],
    ],
};

export const WhatIf2Lockers: Record<WhatIfGuild, Vector4[]> = {
    raider: [
        [1728.19, 2528.98, 44.56, 208.49],
        [1730.71, 2530.16, 44.56, 212.74],
    ],
    warden: [
        [2574.55, -348.18, 91.99, 269.23],
        [2573.61, -344.91, 91.99, 307.49],
    ],
};

export const WhatIf2Cloakroom: WardrobeConfig = {
    [PlayerPedHash.Male]: {
        'Tenue 1': {
            Components: {
                '1': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '2': { Collection: 'mp_m_bikerdlc_01', Drawable: 0, Texture: 0, Palette: 0 },
                '3': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '4': { Collection: 'soz_custom', Drawable: 4, Texture: 0, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_m_smuggler_01', Drawable: 1, Texture: 0, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: 'Male_Heist', Drawable: 8, Texture: 7, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_tuner', Drawable: 19, Texture: 0, Palette: 0 },
            },
        },
        'Tenue 2': {
            Components: {
                '1': { Collection: 'Male_Heist', Drawable: 1, Texture: 0, Palette: 0 },
                '2': { Collection: 'mp_m_bikerdlc_01', Drawable: 0, Texture: 0, Palette: 0 },
                '3': { Collection: '', Drawable: 1, Texture: 0, Palette: 0 },
                '4': { Collection: '', Drawable: 9, Texture: 0, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_m_christmas2017', Drawable: 4, Texture: 1, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_m_security', Drawable: 3, Texture: 0, Palette: 0 },
            },
        },
        'Tenue 3': {
            Components: {
                '1': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '2': { Collection: 'mp_m_bikerdlc_01', Drawable: 0, Texture: 0, Palette: 0 },
                '3': { Collection: '', Drawable: 1, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_m_christmas2018', Drawable: 1, Texture: 3, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_m_gunrunning_01', Drawable: 3, Texture: 1, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 15, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: '', Drawable: 12, Texture: 7, Palette: 0 },
            },
        },
    },
    [PlayerPedHash.Female]: {
        'Tenue 1': {
            Components: {
                '6': { Collection: 'mp_f_bikerdlc_01', Index: 6, Palette: 0, Texture: 4, Drawable: 0 },
                '7': { Collection: '', Index: 7, Palette: 0, Texture: 0, Drawable: 0 },
                '8': { Collection: '', Index: 8, Palette: 0, Texture: 0, Drawable: 2 },
                '9': { Collection: '', Index: 9, Palette: 0, Texture: 0, Drawable: 0 },
                '1': { Collection: '', Index: 1, Palette: 0, Texture: 0, Drawable: 0 },
                '10': { Collection: '', Index: 10, Palette: 0, Texture: 0, Drawable: 0 },
                '11': { Collection: 'Female_Heist', Index: 11, Palette: 0, Texture: 0, Drawable: 17 },
                '2': { Collection: 'soz_custom', Index: 2, Palette: 0, Texture: 0, Drawable: 2 },
                '3': { Collection: 'Female_Heist', Index: 3, Palette: 0, Texture: 0, Drawable: 1 },
                '4': { Collection: 'mp_f_bikerdlc_01', Index: 4, Palette: 0, Texture: 2, Drawable: 1 },
                '5': { Collection: '', Index: 5, Palette: 0, Texture: 0, Drawable: 0 },
            },
        },
        'Tenue 2': {
            Components: {
                '1': { Collection: 'Female_Heist', Drawable: 11, Texture: 0, Palette: 0 },
                '2': { Collection: 'soz_custom', Drawable: 2, Texture: 0, Palette: 0 },
                '3': { Collection: 'Female_Heist', Drawable: 1, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_christmas2018', Drawable: 0, Texture: 0, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 0, Texture: 4, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 2, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_importexport_01', Drawable: 18, Texture: 1, Palette: 0 },
            },
        },
        'Tenue 3': {
            Components: {
                '1': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '2': { Collection: 'soz_custom', Drawable: 2, Texture: 0, Palette: 0 },
                '3': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '4': { Collection: 'soz_bcso', Drawable: 7, Texture: 0, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_f_christmas3', Drawable: 1, Texture: 0, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 2, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'Female_Apt01', Drawable: 6, Texture: 1, Palette: 0 },
            },
        },
        'Tenue 4': {
            Components: {
                '1': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '2': { Collection: 'soz_custom', Drawable: 35, Texture: 0, Palette: 0 },
                '3': { Collection: 'Female_Heist', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_bikerdlc_01', Drawable: 1, Texture: 3, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 0, Texture: 0, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 2, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_importexport_01', Drawable: 19, Texture: 0, Palette: 0 },
            },
        },
        'Tenue 5': {
            Components: {
                '1': { Collection: 'Female_Heist', Drawable: 1, Texture: 0, Palette: 0 },
                '2': { Collection: 'soz_custom', Drawable: 35, Texture: 0, Palette: 0 },
                '3': { Collection: 'Female_Heist', Drawable: 4, Texture: 0, Palette: 0 },
                '4': { Collection: 'Female_freemode_hipster', Drawable: 0, Texture: 3, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_f_battle', Drawable: 1, Texture: 12, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 2, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_lowrider_01', Drawable: 1, Texture: 1, Palette: 0 },
            },
        },
        'Tenue 6': {
            Components: {
                '1': { Collection: 'Female_Heist', Drawable: 1, Texture: 0, Palette: 0 },
                '2': { Collection: 'soz_custom', Drawable: 35, Texture: 0, Palette: 0 },
                '3': { Collection: 'Female_Heist', Drawable: 3, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_christmas2018', Drawable: 1, Texture: 0, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_f_tuner', Drawable: 1, Texture: 10, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: '', Drawable: 14, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_2024_02', Drawable: 26, Texture: 16, Palette: 0 },
            },
        },
        'Tenue 7': {
            Components: {
                '1': { Collection: 'Female_Heist', Drawable: 1, Texture: 0, Palette: 0 },
                '2': { Collection: 'soz_custom', Drawable: 35, Texture: 0, Palette: 0 },
                '3': { Collection: 'Female_Heist', Drawable: 6, Texture: 0, Palette: 0 },
                '4': { Collection: '', Drawable: 1, Texture: 5, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_f_sum2', Drawable: 1, Texture: 0, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: 'Female_freemode_business', Drawable: 0, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: 'mp_f_2023_02', Drawable: 3, Texture: 0, Palette: 0 },
            },
        },
        'Tenue 8': {
            Components: {
                '1': { Collection: 'Female_Heist', Drawable: 1, Texture: 0, Palette: 0 },
                '2': { Collection: 'soz_custom', Drawable: 35, Texture: 0, Palette: 0 },
                '3': { Collection: 'Female_Heist', Drawable: 5, Texture: 0, Palette: 0 },
                '4': { Collection: 'mp_f_christmas2017', Drawable: 5, Texture: 0, Palette: 0 },
                '5': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '6': { Collection: 'mp_f_bikerdlc_01', Drawable: 0, Texture: 1, Palette: 0 },
                '7': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '8': { Collection: 'mp_f_lowrider_01', Drawable: 3, Texture: 0, Palette: 0 },
                '9': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '10': { Collection: '', Drawable: 0, Texture: 0, Palette: 0 },
                '11': { Collection: '', Drawable: 8, Texture: 2, Palette: 0 },
            },
        },
    },
};

export const WhatIf2CraftingTables: Record<WhatIfGuild, Vector4[]> = {
    raider: [
        [1694.341, 2482.805, 44.6215134, -90],
        [1694.39954, 2488.95679, 44.62016, -90],
    ],
    warden: [
        [2567.8042, -360.990631, 92.075, -5],
        [2573.85864, -361.520325, 92.075, -5],
    ],
};

export const WhatIf2CraftsLists: Record<string, CraftCategory> = {
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
};

export const WHAT_IF_PROP_LIST: PlacementPropList = {
    ['Poubelles']: [
        {
            model: 'prop_cs_bin_02',
            label: 'Poubelle 1',
        },
        {
            model: 'prop_cs_dumpster_01a',
            label: 'Benne à ordures 1',
        },
        {
            model: 'prop_rub_binbag_sd_01',
            label: 'Sac poubelle 1',
        },
        {
            model: 'prop_rub_binbag_03',
            label: 'Poubelles en bazar 1',
        },
        {
            model: 'prop_rub_binbag_04',
            label: 'Sac poubelle 2',
        },
        {
            model: 'prop_rub_binbag_05',
            label: 'Sac poubelle 3',
        },
        {
            model: 'prop_bin_01a',
            label: 'Poubelle 2',
        },
        {
            model: 'prop_bin_02a',
            label: 'Poubelle 3',
        },
        {
            model: 'prop_bin_04a',
            label: 'Poubelle 4',
        },
        {
            model: 'prop_bin_05a',
            label: 'Poubelle 5',
        },
        {
            model: 'prop_bin_06a',
            label: 'Poubelle 6',
        },
        {
            model: 'prop_bin_07a',
            label: 'Poubelle 7',
        },
        {
            model: 'prop_bin_08a',
            label: 'Poubelle 8',
        },
        {
            model: 'prop_bin_08open',
            label: 'Poubelle 9',
        },
        {
            model: 'prop_bin_09a',
            label: 'Poubelle 10',
        },
        {
            model: 'prop_bin_10a',
            label: 'Poubelle 11',
        },
        {
            model: 'prop_bin_11a',
            label: 'Poubelle 12',
        },
        {
            model: 'prop_bin_14a',
            label: 'Benne à ordures 2',
        },
        {
            model: 'prop_bin_beach_01d',
            label: 'Poubelle de plage 1',
        },
        {
            model: 'prop_bin_delpiero',
            label: 'Poubelle de plage 2',
        },
        {
            model: 'prop_bin_delpiero_b',
            label: 'Poubelle de plage 3',
        },
        {
            model: 'prop_dumpster_02a',
            label: 'Benne à ordures 3',
        },
        {
            model: 'prop_dumpster_4b',
            label: 'Benne à ordures 4',
        },
        {
            model: 'prop_recyclebin_04_a',
            label: 'Poubelle de recyclage 1',
        },
        {
            model: 'prop_recyclebin_04_b',
            label: 'Poubelle de recyclage 2',
        },
        {
            model: 'prop_recyclebin_05_a',
            label: 'Poubelle de recyclage 3',
        },
    ],
};

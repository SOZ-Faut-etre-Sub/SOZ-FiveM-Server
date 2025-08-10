import { WardrobeConfig } from '@public/shared/cloth';
import { CraftCategory } from '@public/shared/craft/craft';
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

export const WhatIfSafeZones: Record<WhatIfGuild, PolygonZone> = {
    raider: new PolygonZone([
        [1639.5460396886765, 2768.581216950348],
        [1773.2215293346835, 2778.756540427393],
        [1790.2141763235823, 2775.3647659350445],
        [1857.0519211465862, 2710.921050580424],
        [1862.7161368095522, 2693.9621781186815],
        [1861.5832936769593, 2525.50404499871],
        [1852.5205486162122, 2482.5415680956303],
        [1816.269568373229, 2438.4484996951014],
        [1772.0886862020907, 2397.747205786919],
        [1666.7342748709161, 2379.6577418277284],
        [1640.6788828212711, 2386.441290812425],
        [1533.0587852249091, 2453.1461891619438],
        [1526.205742902449, 2463.84608523535],
        [1519.4086841068893, 2583.6887839649935],
        [1549.9954486869074, 2676.3972867558505],
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

export enum WhatIf2LootType {
    Low,
    Medium,
    High,
    Military,
}

export const WhatIf2LootInventoryType: Record<WhatIf2LootType, string> = {
    [WhatIf2LootType.Low]: 'zombie',
    [WhatIf2LootType.Medium]: 'huge_stash',
    [WhatIf2LootType.High]: 'what_if_loot_low',
    [WhatIf2LootType.Military]: 'what_if_loot_medium',
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
    what_if_loot_low: {},
    what_if_loot_medium: {},
    what_if_loot_high: {},
};

export const WhatIf2RespawnPoints: Record<WhatIfGuild, Vector4[]> = {
    raider: [[1663.61, 2519.21, 45.57, 352.21]],
    warden: [[2505.71, -384.81, 94.12, 0]],
};

export const WhatIf2Lockers: Record<WhatIfGuild, Vector4[]> = {
    raider: [[1746.51, 2501.78, 44.56, 163.06]],
    warden: [],
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
    },
};

export const WhatIf2CraftingTables: Record<WhatIfGuild, Vector4[]> = {
    raider: [[1752.97, 2504.42, 44.57, 206.94]],
    warden: [],
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

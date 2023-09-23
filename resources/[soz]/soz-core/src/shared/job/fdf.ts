import { WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
import { Environment } from '../features';
import { joaat } from '../joaat';
import { BoxZone, NamedZone } from '../polyzone/box.zone';
import { PolygonZone } from '../polyzone/polygon.zone';
import { Vector3, Vector4 } from '../polyzone/vector';
import { ProgressAnimation } from '../progress';

export type TreeStatus = {
    cutDate: number;
    nbWater: number;
    lastWater: number;
    objectRemaining: number;
    item: string;
};

export enum FDFFieldKind {
    apple = 'apple',
    orange = 'orange',
    field = 'field',
    greenhouse = 'greenhouse',
}

export enum FDFFieldBlips {
    apple = 'apple',
    orange = 'orange',
    field = 'field',
    greenhouse = 'greenhouse',
    resell = 'resell',
}

export const FDFFieldMenu: Record<FDFFieldBlips, string> = {
    [FDFFieldBlips.field]: 'Afficher les champs',
    [FDFFieldBlips.greenhouse]: 'Afficher les serres',
    [FDFFieldBlips.apple]: 'Afficher les pommiers',
    [FDFFieldBlips.orange]: 'Afficher les orangers',
    [FDFFieldBlips.resell]: 'Afficher les points de vente',
};

export const FDFTreeField: Partial<Record<FDFFieldKind, PolygonZone<Vector4>>> = {
    [FDFFieldKind.apple]: new PolygonZone(
        [
            [2338.036545732639, 5070.262655737755],
            [2270.662524319363, 5005.807913211236],
            [2366.3449580911583, 4908.560406943154],
            [2438.248325481797, 4987.715353905546],
        ],
        {
            data: [2358.09, 4738.21, 34.54, 30.0],
        }
    ),
    [FDFFieldKind.orange]: new PolygonZone(
        [
            [2304.0664509024155, 4779.650921890116],
            [2289.9122447231557, 4718.02314175511],
            [2344.2643964515137, 4701.62675988433],
            [2441.079166717649, 4595.898366441706],
            [2494.298981951666, 4645.0875120540495],
            [2366.3449580911583, 4764.3853249759395],
        ],
        {
            data: [2346.96, 4996.11, 42.73, 30.0],
        }
    ),
};

export const FDFFields: Record<string, PolygonZone<Vector4>> = {
    1: new PolygonZone(
        [
            [2904.35, 4647.19],
            [2896.72, 4687.34],
            [2943.82, 4697.82],
            [2949.14, 4672.79],
            [2926.77, 4666.78],
        ],
        {
            data: [2920.87, 4679.03, 49.59, 30.0],
            minZ: 38.59,
            maxZ: 59.59,
        }
    ),
    2: new PolygonZone(
        [
            [2881.39, 4677.59],
            [2902.34, 4597.97],
            [2884.98, 4578.29],
            [2843.36, 4567.62],
            [2837.18, 4590.54],
            [2817.42, 4585.5],
            [2800.25, 4647.78],
            [2810.45, 4658.98],
        ],
        {
            data: [2852.22, 4630.84, 48.93, 30.0],
            minZ: 37.93,
            maxZ: 58.93,
        }
    ),
    6: new PolygonZone(
        [
            [2619.1, 4743.3],
            [2667.01, 4698.27],
            [2685.8, 4635.33],
            [2678.28, 4630.17],
            [2597.7, 4714.18],
            [2597.47, 4722.97],
        ],
        {
            data: [2646.67, 4694.45, 35.73, 30.0],
            minZ: 24.73,
            maxZ: 45.73,
        }
    ),
    7: new PolygonZone(
        [
            [2455.51, 4843.27],
            [2496.13, 4884.67],
            [2523.84, 4859.09],
            [2491.5, 4825.44],
            [2474.25, 4826.54],
        ],
        {
            data: [2491.29, 4856.94, 36.68, 30.0],
            minZ: 25.68,
            maxZ: 46.68,
        }
    ),
    8: new PolygonZone(
        [
            [2496.91, 4817.56],
            [2530.88, 4852.87],
            [2588.81, 4800.21],
            [2562.2, 4774.17],
            [2544.48, 4774.55],
        ],
        {
            data: [2538.56, 4808.0, 33.69, 30.0],
            minZ: 22.69,
            maxZ: 43.69,
        }
    ),
    10: new PolygonZone(
        [
            [2145.49, 5212.54],
            [2172.17, 5208.51],
            [2199.61, 5193.92],
            [2217.38, 5175.17],
            [2196.88, 5155.49],
        ],
        {
            data: [2186.29, 5187.04, 58.78, 30.0],
            minZ: 47.78,
            maxZ: 68.78,
        }
    ),
    11: new PolygonZone(
        [
            [2077.28, 5184.73],
            [2104.18, 5207.26],
            [2135.04, 5214.82],
            [2194.83, 5151.57],
            [2146.48, 5109.64],
        ],
        {
            data: [2132.67, 5166.38, 53.22, 30.0],
            minZ: 42.22,
            maxZ: 63.22,
        }
    ),
    12: new PolygonZone(
        [
            [2298.23, 5169.02],
            [2352.52, 5116.19],
            [2326.38, 5088.04],
            [2309.04, 5088.96],
            [2260.69, 5135.06],
        ],
        {
            data: [2308.95, 5133.16, 50.62, 30.0],
            minZ: 39.62,
            maxZ: 60.62,
        }
    ),
    13: new PolygonZone(
        [
            [2300.82, 5065.21],
            [2222.21, 5142.85],
            [2172.01, 5094.21],
            [2194.03, 5072.14],
            [2183.71, 5062.16],
            [2225.78, 5019.31],
            [2246.15, 5038.74],
            [2260.75, 5023.89],
        ],
        {
            data: [2236.87, 5075.51, 47.52, 30.0],
            minZ: 36.52,
            maxZ: 57.52,
        }
    ),
    14: new PolygonZone(
        [
            [1875.19, 4766.73],
            [1832.11, 4809.3],
            [1869.6, 4846.49],
            [1918.6, 4797.53],
        ],
        {
            data: [1882.96, 4805.5, 44.91, 30.0],
            minZ: 33.91,
            maxZ: 54.91,
        }
    ),
    15: new PolygonZone(
        [
            [1950.85, 4764.55],
            [1924.34, 4792.08],
            [1903.14, 4776.37],
            [1879.02, 4762.28],
            [1902.55, 4739.17],
            [1909.31, 4736.61],
            [1930.65, 4747.79],
        ],
        {
            data: [1907.68, 4760.01, 42.57, 30.0],
            minZ: 31.57,
            maxZ: 52.57,
        }
    ),
    17: new PolygonZone(
        [
            [1959.6, 4825.39],
            [1985.36, 4799.74],
            [1953.18, 4767.42],
            [1927.3, 4793.69],
        ],
        {
            data: [1955.7, 4795.39, 43.55, 30.0],
            minZ: 32.55,
            maxZ: 53.55,
        }
    ),
    19: new PolygonZone(
        [
            [1961.75, 4882.28],
            [1979.64, 4864.02],
            [1945.36, 4829.64],
            [1927.69, 4847.16],
        ],
        {
            data: [1957.0, 4859.6, 45.47, 30.0],
            minZ: 34.47,
            maxZ: 55.47,
        }
    ),
    21: new PolygonZone(
        [
            [2031.62, 4852.72],
            [1980.52, 4902.88],
            [2045.81, 4968.24],
            [2097.55, 4917.32],
        ],
        {
            data: [2037.25, 4910.19, 41.58, 30.0],
            minZ: 30.58,
            maxZ: 51.58,
        }
    ),
};

export const FDFGreenHouse: Record<string, PolygonZone<Vector4>> = {
    4: new PolygonZone(
        [
            [2298.75, 4775.63],
            [2292.67, 4748.1],
            [2218.14, 4768.43],
            [2227.49, 4798.77],
        ],
        {
            data: [2254.18, 4777.98, 39.53, 30.0],
            minZ: 28.53,
            maxZ: 49.53,
        }
    ),
    5: new PolygonZone(
        [
            [2637.51, 4761.5],
            [2657.32, 4743.12],
            [2664.17, 4704.5],
            [2621.85, 4745.89],
        ],
        {
            data: [2647.62, 4737.33, 35.08, 30.0],
            minZ: 24.08,
            maxZ: 45.08,
        }
    ),
    16: new PolygonZone(
        [
            [1920.12, 4798.88],
            [1871.76, 4848.18],
            [1893.59, 4872.14],
            [1944.33, 4821.41],
        ],
        {
            data: [1918.63, 4823.9, 45.44, 30.0],
            minZ: 34.44,
            maxZ: 55.44,
        }
    ),
    18: new PolygonZone(
        [
            [1919.52, 4849.29],
            [1894.52, 4873.89],
            [1902.89, 4894.55],
            [1930.53, 4923.16],
            [1960.58, 4893.75],
        ],
        {
            data: [1919.73, 4889.06, 47.47, 30.0],
            minZ: 36.47,
            maxZ: 57.47,
        }
    ),
    20: new PolygonZone(
        [
            [1960.48, 4826.28],
            [1994.77, 4858.23],
            [2012.43, 4839.26],
            [2012.49, 4826.38],
            [1987.03, 4800.27],
        ],
        {
            data: [1997.59, 4819.56, 43.11, 30.0],
            minZ: 32.11,
            maxZ: 53.11,
        }
    ),
    22: new PolygonZone(
        [
            [1779.75, 4941.38],
            [1745.01, 4979.94],
            [1805.18, 5031.76],
            [1838.52, 4992.83],
        ],
        {
            data: [1796.84, 4983.04, 49.92, 30.0],
            minZ: 38.92,
            maxZ: 59.92,
        }
    ),
    23: new PolygonZone(
        [
            [1857.53, 5008.38],
            [1822.44, 5045.61],
            [1897.83, 5110],
            [1922.51, 5110.04],
            [1945.96, 5082.48],
        ],
        {
            data: [1888.84, 5066.83, 49.4, 30.0],
            minZ: 38.4,
            maxZ: 59.4,
        }
    ),
    24: new PolygonZone(
        [
            [1931.94, 5045.29],
            [1953.19, 5019.57],
            [1893.04, 4968.26],
            [1871.63, 4994.03],
        ],
        {
            data: [1912.9, 5007.71, 45.76, 30.0],
            minZ: 35.76,
            maxZ: 55.76,
        }
    ),
};

export type FDFCropConfigType = {
    seed: string;
    prop: number;
    fieldConfig: FDFFieldsConfigType;
    harvestCount: number;
};

export enum FDFCropType {
    potato = 'potato',
    tomato = 'tomato',
    corn = 'corn',
    cabage = 'cabage',
    pumpkin_fresh = 'pumpkin_fresh',
}

export type FDFFieldsConfigType = {
    fields: Record<string, PolygonZone<Vector4>>;
    maxprop: number;
    speedLabel: string;
    hillingText: string;
    progressText: string;
    hillingAnim: ProgressAnimation;
};

export const FDFFieldConfig: FDFFieldsConfigType = {
    fields: FDFFields,
    maxprop: 40,
    speedLabel: 'Butter',
    hillingText: 'Vous avez butté un plant, il sera récoltable un peu plus tôt.',
    progressText: 'Buttage en cours...',
    hillingAnim: {
        task: 'WORLD_HUMAN_GARDENER_PLANT',
    },
};

export const FDFGreenhouseConfig: FDFFieldsConfigType = {
    fields: FDFGreenHouse,
    maxprop: 20,
    speedLabel: 'Répulser',
    hillingText: 'Vous avez répulsé un plant, il sera récoltable un peu plus tôt.',
    progressText: 'Répulsage en cours...',
    hillingAnim: {
        dictionary: 'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
        name: 'weed_spraybottle_stand_kneeling_01_inspector',
        options: {
            repeat: true,
        },
        props: [
            {
                model: 'bkr_prop_weed_spray_01a',
                bone: 28422,
                position: [0.01, -0.01, -0.06],
                rotation: [0.0, 0.0, 0.0],
            },
        ],
    },
};

export const FDFCropConfig: Record<FDFCropType, FDFCropConfigType> = {
    [FDFCropType.potato]: {
        seed: 'potato_seed',
        fieldConfig: FDFFieldConfig,
        prop: joaat('prop_veg_crop_04_leaf'),
        harvestCount: 4,
    },
    [FDFCropType.tomato]: {
        seed: 'tomato_seed',
        fieldConfig: FDFFieldConfig,
        prop: joaat('prop_veg_crop_02'),
        harvestCount: 4,
    },
    [FDFCropType.corn]: {
        seed: 'corn_seed',
        fieldConfig: FDFFieldConfig,
        prop: joaat('soz_prop_veg_corn_01'),
        harvestCount: 4,
    },
    [FDFCropType.cabage]: {
        seed: 'cabage_seed',
        prop: joaat('prop_veg_crop_03_cab'),
        fieldConfig: FDFGreenhouseConfig,
        harvestCount: 1,
    },
    [FDFCropType.pumpkin_fresh]: {
        seed: 'pumpkin_seed',
        prop: joaat('prop_veg_crop_03_pump'),
        fieldConfig: FDFGreenhouseConfig,
        harvestCount: 1,
    },
};

export type FDFCrop = {
    type: FDFCropType;
    coords: Vector3;
    createdAt: number;
    hilled: boolean;
    field: string;
};

export function canTreeBeWater(tree: TreeStatus): boolean {
    if (!tree) {
        return false;
    }

    const env = GetConvar('soz_core_environment', 'development') as Environment;
    const delay = env == 'production' ? FDFConfig.waterDelay : FDFConfig.waterDelayTst;
    const waterGain = env == 'production' ? FDFConfig.waterGain : FDFConfig.waterGainTst;

    const now = Date.now();
    if (now < tree.lastWater + delay) {
        return false;
    }

    if (now - tree.cutDate + tree.nbWater * waterGain > FDFConfig.treeHarvestDelay) {
        return false;
    }

    return true;
}

export function canTreeBeHarvest(tree: TreeStatus): boolean {
    if (!tree) {
        return false;
    }

    const env = GetConvar('soz_core_environment', 'development') as Environment;
    const waterGain = env == 'production' ? FDFConfig.waterGain : FDFConfig.waterGainTst;

    const now = Date.now();
    if (now - tree.cutDate + tree.nbWater * waterGain < FDFConfig.treeHarvestDelay) {
        return false;
    }

    return tree.objectRemaining > 0;
}

export function canCropBeHilled(crop: FDFCrop): boolean {
    if (!crop) {
        return false;
    }

    const env = GetConvar('soz_core_environment', 'development') as Environment;
    const delay = env == 'production' ? FDFConfig.hillDelay : FDFConfig.hillDelayTst;

    const now = Date.now();
    return now - crop.createdAt > delay && !crop.hilled;
}

export function canCropBeHarvest(crop: FDFCrop): boolean {
    if (!crop) {
        return false;
    }

    const env = GetConvar('soz_core_environment', 'development') as Environment;
    const hillGain = env == 'production' ? FDFConfig.hillGain : FDFConfig.hillGainTst;

    const now = Date.now();
    return now - crop.createdAt + (crop.hilled ? hillGain : 0) > FDFConfig.cropHarvestDelay;
}

export const FDFConfig = {
    waterDelay: 20 * 60000,
    waterDelayTst: 60000,
    hillDelay: 30 * 60000,
    hillDelayTst: 60000,
    waterGain: 10 * 60000,
    waterGainTst: 60 * 60000,
    treeHarvestDelay: 2 * 3600 * 1000,
    treeHarvestItemCount: [1, 4],
    hillGain: 10 * 60000,
    hillGainTst: 60 * 60000,
    cropHarvestDelay: 3600 * 1000,
    fieldCheckpointsCount: 10,
    resellZones: [
        {
            name: 'Resell:FDF:Silo',
            zone: new BoxZone([2892.55, 4391.29, 50.35], 4.4, 4.6, {
                heading: 23.57,
                minZ: 49.35,
                maxZ: 51.35,
            }),
            npcCoord: [2890.95, 4391.49, 49.34, 250.01] as Vector4,
            npcModel: 'a_m_m_farmer_01',
        },
        {
            name: 'Resell:FDF:Bell-Farm',
            zone: new BoxZone([90.2, 6363.95, 31.23], 6.0, 5.0, {
                heading: 204.35,
                minZ: 30.23,
                maxZ: 32.23,
            }),
            npcCoord: [91.34, 6361.86, 30.23, 25.42] as Vector4,
            npcModel: 'a_m_m_farmer_01',
        },
    ],
};

//TODO
export const fdfCraftZones: NamedZone[] = [
    {
        name: 'baun:unicorn:craft:1',
        center: [130.19, -1280.92, 29.27],
        length: 0.2,
        width: 0.2,
        heading: 25,
        minZ: 29.27,
        maxZ: 29.67,
    },
    {
        name: 'baun:bahama:craft:1',
        center: [-1392.21, -606.3, 30.32],
        length: 0.2,
        width: 0.2,
        heading: 0,
        minZ: 30.37,
        maxZ: 30.77,
    },
    {
        name: 'baun:bahama:craft:2',
        center: [-1377.96, -628.86, 30.82],
        length: 0.2,
        width: 0.2,
        heading: 0,
        minZ: 30.82,
        maxZ: 31.22,
    },
    {
        name: 'baun:yellowjack:craft:1',
        center: [1980.87, 3052.41, 47.21],
        length: 0.6,
        width: 0.25,
        heading: 238.8,
        minZ: 47.12,
        maxZ: 47.72,
    },
];

//TODO
export const FDFCraftsLists: Record<string, CraftCategory> = {
    Cocktails: {
        duration: 4000,
        recipes: {
            narito: {
                amount: 1,
                inputs: {
                    rhum: { count: 1 },
                    cane_sugar: { count: 1 },
                    green_lemon: { count: 1 },
                    fruit_slice: { count: 1 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            lapicolada: {
                amount: 1,
                inputs: {
                    rhum: { count: 1 },
                    coconut_milk: { count: 1 },
                    ananas_juice: { count: 1 },
                    fruit_slice: { count: 1 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            sunrayou: {
                amount: 1,
                inputs: {
                    tequila: { count: 1 },
                    orange_juice: { count: 1 },
                    strawberry_juice: { count: 1 },
                    cane_sugar: { count: 1 },
                    fruit_slice: { count: 1 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            ponche: {
                amount: 1,
                inputs: {
                    rhum: { count: 1 },
                    orange_juice: { count: 1 },
                    ananas_juice: { count: 1 },
                    cane_sugar: { count: 1 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            pinkenny: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    green_lemon: { count: 1 },
                    strawberry_juice: { count: 1 },
                    apple_juice: { count: 1 },
                    cane_sugar: { count: 1 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            phasmopolitan: {
                amount: 1,
                inputs: {
                    gin: { count: 1 },
                    green_lemon: { count: 1 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            escalier: {
                amount: 1,
                inputs: {
                    cognac: { count: 1 },
                    orange_juice: { count: 1 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            whicanelle: {
                amount: 1,
                inputs: {
                    whisky: { count: 1 },
                    apple_juice: { count: 1 },
                    green_lemon: { count: 1 },
                    cane_sugar: { count: 1 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
        },
    },
};

export const FDFCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ['Responsable des Cultures']: {
            Components: {
                [3]: { Drawable: 138, Texture: 3, Palette: 0 },
                [4]: { Drawable: 89, Texture: 23, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 62, Texture: 4, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [11]: { Drawable: 313, Texture: 17, Palette: 0 },
            },
            Props: { [0]: { Drawable: 13, Texture: 3, Palette: 0 } },
        },
        ['Fermier']: {
            Components: {
                [3]: { Drawable: 138, Texture: 4, Palette: 0 },
                [4]: { Drawable: 89, Texture: 18, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 51, Texture: 3, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [11]: { Drawable: 325, Texture: 11, Palette: 0 },
            },
            Props: { [0]: { Drawable: 13, Texture: 3, Palette: 0 } },
        },
        ['Stagiaire']: {
            Components: {
                [3]: { Drawable: 138, Texture: 4, Palette: 0 },
                [4]: { Drawable: 90, Texture: 3, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 51, Texture: 3, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [11]: { Drawable: 56, Texture: 0, Palette: 0 },
            },
            Props: { [0]: { Drawable: 13, Texture: 3, Palette: 0 } },
        },
    },
    [joaat('mp_f_freemode_01')]: {
        ['Responsable des Cultures']: {
            Components: {
                [3]: { Drawable: 182, Texture: 3, Palette: 0 },
                [4]: { Drawable: 92, Texture: 23, Palette: 0 },
                [5]: { Drawable: 81, Texture: 0, Palette: 0 },
                [6]: { Drawable: 66, Texture: 4, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [11]: { Drawable: 224, Texture: 18, Palette: 0 },
            },
            Props: { [0]: { Drawable: 20, Texture: 1, Palette: 0 } },
        },
        ['Fermier']: {
            Components: {
                [3]: { Drawable: 182, Texture: 4, Palette: 0 },
                [4]: { Drawable: 92, Texture: 18, Palette: 0 },
                [5]: { Drawable: 81, Texture: 0, Palette: 0 },
                [6]: { Drawable: 52, Texture: 3, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [11]: { Drawable: 224, Texture: 19, Palette: 0 },
            },
            Props: {
                [0]: { Drawable: 20, Texture: 0, Palette: 0 },
                [1]: { Drawable: 5, Texture: 0, Palette: 0 },
            },
        },
        ['Stagiaire']: {
            Components: {
                [3]: { Drawable: 182, Texture: 4, Palette: 0 },
                [4]: { Drawable: 93, Texture: 7, Palette: 0 },
                [5]: { Drawable: 81, Texture: 0, Palette: 0 },
                [6]: { Drawable: 52, Texture: 3, Palette: 0 },
                [8]: { Drawable: 14, Texture: 0, Palette: 0 },
                [11]: { Drawable: 73, Texture: 0, Palette: 0 },
            },
            Props: {
                [0]: { Drawable: 20, Texture: 0, Palette: 0 },
                [1]: { Drawable: 5, Texture: 0, Palette: 0 },
            },
        },
    },
};

import { Vector2, Vector3 } from '@public/shared/polyzone/vector';

import { Prop, WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
import { Feature } from '../features';
import { joaat } from '../joaat';
import { NamedZone } from '../polyzone/box.zone';

export const FoodHuntConfig = {
    noSpawnDelay: 3600_000,
    noSpawnHarvestCount: 10,
};

export const CraftZones: NamedZone[] = [
    {
        name: 'food_craft_1',
        center: [-1895.98, 2067.29, 140.33],
        length: 1.8,
        width: 4.2,
        heading: 321.79,
        minZ: 139.33,
        maxZ: 141.33,
    },
    {
        name: 'food_craft_2',
        center: [-1900.68, 2071.03, 140.19],
        length: 1.8,
        width: 4.4,
        heading: 321.21,
        minZ: 139.19,
        maxZ: 141.19,
    },
];

export const FoodCraftsLists: Record<string, CraftCategory> = {
    Vins: {
        animation: {
            dictionary: 'amb@prop_human_bbq@male@idle_a',
            name: 'idle_b',
            options: {
                repeat: true,
            },
        },
        duration: 20000,
        icon: '🍷',
        event: 'job_cm_food_craft',
        recipes: {
            wine1: {
                inputs: {
                    grape1: { count: 10 },
                },
                amount: 1,
            },
            wine2: {
                inputs: {
                    grape2: { count: 10 },
                },
                amount: 1,
            },
            wine3: {
                inputs: {
                    grape3: { count: 10 },
                },
                amount: 1,
            },
            wine4: {
                inputs: {
                    grape4: { count: 10 },
                },
                amount: 1,
            },
        },
    },
    Jus: {
        animation: {
            dictionary: 'amb@prop_human_bbq@male@idle_a',
            name: 'idle_b',
            options: {
                repeat: true,
            },
        },
        duration: 8000,
        icon: '🧃',
        event: 'job_cm_food_craft',
        recipes: {
            grapejuice1: {
                inputs: {
                    grape1: { count: 4 },
                },
                amount: 4,
            },
            grapejuice2: {
                inputs: {
                    grape2: { count: 4 },
                },
                amount: 4,
            },
            grapejuice3: {
                inputs: {
                    grape3: { count: 4 },
                },
                amount: 4,
            },
            grapejuice4: {
                inputs: {
                    grape1: { count: 2 },
                    grape2: { count: 2 },
                    grape3: { count: 2 },
                    grape4: { count: 2 },
                },
                amount: 4,
            },
            grapejuice5: {
                inputs: {
                    grape4: { count: 4 },
                },
                amount: 4,
            },
        },
    },
    Fromage: {
        duration: 6000,
        icon: '🧀',
        event: 'job_cm_food_craft',
        recipes: {
            cheese1: {
                inputs: {
                    skimmed_milk: { count: 1 },
                },
                amount: 3,
            },
            cheese2: {
                inputs: {
                    milk: { count: 1 },
                },
                amount: 3,
            },
            cheese3: {
                inputs: {
                    milk: { count: 1 },
                },
                amount: 3,
            },
            cheese4: {
                inputs: {
                    semi_skimmed_milk: { count: 1 },
                },
                amount: 3,
            },
            cheese5: {
                inputs: {
                    semi_skimmed_milk: { count: 1 },
                },
                amount: 3,
            },
            cheese6: {
                inputs: {
                    semi_skimmed_milk: { count: 1 },
                },
                amount: 3,
            },
            cheese7: {
                inputs: {
                    milk: { count: 1 },
                },
                amount: 3,
            },
            cheese8: {
                inputs: {
                    skimmed_milk: { count: 1 },
                },
                amount: 3,
            },
            cheese9: {
                inputs: {
                    skimmed_milk: { count: 1 },
                },
                amount: 3,
            },
        },
    },
    Saucissons: {
        duration: 8000,
        icon: '🌭',
        event: 'job_cm_food_craft',
        recipes: {
            sausage1: {
                inputs: {
                    abat: { count: 4 },
                    langue: { count: 4 },
                    rognon: { count: 4 },
                    tripe: { count: 4 },
                    viande: { count: 4 },
                },
                amount: 4,
            },
            sausage2: {
                inputs: {
                    abat: { count: 4 },
                    langue: { count: 4 },
                    rognon: { count: 4 },
                    tripe: { count: 4 },
                    viande: { count: 4 },
                },
                amount: 4,
            },
            sausage3: {
                inputs: {
                    abat: { count: 4 },
                    langue: { count: 4 },
                    rognon: { count: 4 },
                    tripe: { count: 4 },
                    viande: { count: 4 },
                },
                amount: 4,
            },
            sausage4: {
                inputs: {
                    abat: { count: 4 },
                    langue: { count: 4 },
                    rognon: { count: 4 },
                    tripe: { count: 4 },
                    viande: { count: 4 },
                },
                amount: 4,
            },
            sausage5: {
                inputs: {
                    abat: { count: 4 },
                    langue: { count: 4 },
                    rognon: { count: 4 },
                    tripe: { count: 4 },
                    viande: { count: 4 },
                },
                amount: 4,
            },
        },
    },
    Pâques: {
        feature: Feature.EasterFood,
        duration: 5000,
        icon: '🥚',
        event: 'job_cm_food_craft',
        recipes: {
            easter_basket: {
                inputs: {
                    chocolat_egg: { count: 2 },
                    chocolat_milk_egg: { count: 2 },
                },
                amount: 1,
            },
        },
    },
    ['Plats à base de viande']: {
        duration: 8000,
        icon: '🥩',
        event: 'job_cm_food_craft',
        recipes: {
            beef_symfony_truffle: {
                inputs: {
                    viande: { count: 4 },
                    mushroom: { count: 3 },
                    wine1: { count: 1 },
                },
                amount: 4,
            },
            crunchy_lamp_chop: {
                inputs: {
                    viande: { count: 2 },
                    vegetable_palette: { count: 1 },
                    milk: { count: 1 },
                },
                amount: 4,
            },
            rosmarino_veal_filet: {
                inputs: {
                    viande: { count: 2 },
                    potato: { count: 2 },
                    milk: { count: 1 },
                },
                amount: 4,
            },
            spicy_sichuan_duck_breast: {
                inputs: {
                    viande: { count: 2 },
                    potato: { count: 2 },
                    wine4: { count: 1 },
                },
                amount: 4,
            },
        },
    },
    ['Plats à base de poissons/crustacés']: {
        duration: 8000,
        icon: '🐟',
        event: 'job_cm_food_craft',
        recipes: {
            scallops_goldn_corn: {
                inputs: {
                    fish_preparation: { count: 4 },
                    corn: { count: 2 },
                    milk: { count: 1 },
                    sausage3: { count: 1 },
                },
                amount: 4,
            },
            deep_sea_turbot: {
                inputs: {
                    fish_preparation: { count: 4 },
                    tomato: { count: 1 },
                    lemon: { count: 1 },
                    cabage: { count: 1 },
                },
                amount: 4,
            },
            herbarium_cod: {
                inputs: {
                    fish_preparation: { count: 4 },
                    potato: { count: 1 },
                    vegetable_palette: { count: 1 },
                    wine3: { count: 1 },
                },
                amount: 4,
            },
            ocean_awakening: {
                inputs: {
                    fish_preparation: { count: 4 },
                    apple: { count: 1 },
                    milk: { count: 1 },
                    wine3: { count: 1 },
                },
                amount: 4,
            },
        },
    },
    ['Plats exotiques']: {
        duration: 8000,
        icon: '🌴',
        event: 'job_cm_food_craft',
        recipes: {
            tropical_goat_curry: {
                inputs: {
                    viande: { count: 2 },
                    potato: { count: 1 },
                    tomato: { count: 1 },
                    lemon: { count: 1 },
                },
                amount: 4,
            },
            tikka_royal: {
                inputs: {
                    viande: { count: 2 },
                    milk: { count: 1 },
                    vegetable_palette: { count: 1 },
                    lemon: { count: 1 },
                },
                amount: 4,
            },
            sand_tagine: {
                inputs: {
                    viande: { count: 2 },
                    vegetable_palette: { count: 1 },
                    lemon: { count: 1 },
                    orange: { count: 1 },
                },
                amount: 4,
            },
            end_world_tataki: {
                inputs: {
                    viande: { count: 2 },
                    potato: { count: 2 },
                    lemon: { count: 1 },
                    smuggling_zibwasser_zoublon: { count: 1 },
                },
                amount: 4,
            },
        },
    },
    Halloween: {
        feature: Feature.Halloween,
        duration: 5000,
        icon: '🎃',
        event: 'job_cm_food_craft',
        recipes: {
            halloween_midnight_cheese: {
                inputs: {
                    milk: { count: 3 },
                },
                amount: 1,
            },
            halloween_damned_wine: {
                inputs: {
                    grape1: { count: 1 },
                    grape2: { count: 1 },
                    grape3: { count: 1 },
                    grape4: { count: 1 },
                },
                amount: 1,
            },
        },
    },
};

export const FoodCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ['Tenue de Direction']: {
            Components: {
                [3]: { Drawable: 6, Texture: 0, Palette: 0 },
                [4]: { Drawable: 24, Texture: 0, Palette: 0 },
                [6]: { Drawable: 10, Texture: 0, Palette: 0 },
                [7]: { Drawable: 117, Texture: 4, Palette: 0 },
                [8]: { Drawable: 31, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 29, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de travail']: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [4]: { Drawable: 90, Texture: 0, Palette: 0 },
                [6]: { Drawable: 51, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 1, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de prestation']: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 24, Texture: 4, Palette: 0 },
                [5]: { Drawable: 86, Texture: 9, Palette: 0 },
                [6]: { Drawable: 10, Texture: 0, Palette: 0 },
                [7]: { Drawable: 31, Texture: 2, Palette: 0 },
                [8]: { Drawable: 148, Texture: 10, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 31, Texture: 4, Palette: 0 },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: 7,
                    Texture: 2,
                    Palette: 0,
                },
            },
        },
        ["Tenue d'hiver"]: {
            Components: {
                [3]: { Drawable: 96, Texture: 0, Palette: 0 },
                [4]: { Drawable: 0, Texture: 8, Palette: 0 },
                [6]: { Drawable: 12, Texture: 6, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 24, Texture: 1, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 69, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de Chasse']: {
            Components: {
                [3]: { Drawable: 208, Texture: 5, Palette: 0 },
                [4]: { Drawable: 97, Texture: 5, Palette: 0 },
                [6]: { Drawable: 72, Texture: 23, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 0, Texture: 20, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 248, Texture: 3, Palette: 0 },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: 142,
                    Texture: 16,
                    Palette: 0,
                },
            },
        },
    },

    [joaat('mp_f_freemode_01')]: {
        ['Tenue de Direction']: {
            Components: {
                [3]: { Drawable: 6, Texture: 0, Palette: 0 },
                [4]: { Drawable: 12, Texture: 7, Palette: 0 },
                [6]: { Drawable: 11, Texture: 2, Palette: 0 },
                [8]: { Drawable: 151, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 25, Texture: 7, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de travail']: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [4]: { Drawable: 93, Texture: 0, Palette: 0 },
                [6]: { Drawable: 52, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 1, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 0, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de prestation']: {
            Components: {
                [3]: { Drawable: 7, Texture: 0, Palette: 0 },
                [4]: { Drawable: 37, Texture: 4, Palette: 0 },
                [5]: { Drawable: 86, Texture: 9, Palette: 0 },
                [6]: { Drawable: 29, Texture: 0, Palette: 0 },
                [7]: { Drawable: 31, Texture: 2, Palette: 0 },
                [8]: { Drawable: 38, Texture: 2, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 57, Texture: 4, Palette: 0 },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: 168,
                    Texture: 2,
                    Palette: 0,
                },
            },
        },
        ["Tenue d'hiver"]: {
            Components: {
                [3]: { Drawable: 44, Texture: 0, Palette: 0 },
                [4]: { Drawable: 1, Texture: 4, Palette: 0 },
                [6]: { Drawable: 101, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 44, Texture: 1, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 63, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de Chasse']: {
            Components: {
                [3]: { Drawable: 227, Texture: 5, Palette: 0 },
                [4]: { Drawable: 4, Texture: 15, Palette: 0 },
                [6]: { Drawable: 73, Texture: 4, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 229, Texture: 19, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 256, Texture: 3, Palette: 0 },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: 141,
                    Texture: 16,
                    Palette: 0,
                },
            },
        },
    },
};

export enum FoodFieldType {
    Cardinal = 'cardinal',
    Muscat = 'muscat',
    Centennial = 'centennial',
    Chasselas = 'chasselas',
}

export type FoodField = {
    harvest: {
        delay: number;
        min: number;
        max: number;
    };
    capacity: {
        start: number;
        max: number;
    };
    refill: {
        delay: number;
        amount: number;
    };
    item: string;
    zones: (Vector2 | Vector3)[][];
};

export const FoodFields: Record<FoodFieldType, FoodField> = {
    [FoodFieldType.Cardinal]: {
        capacity: { start: 500, max: 800 },
        harvest: { delay: 10_000, min: 3, max: 5 },
        refill: {
            delay: 60_000,
            amount: 2,
        },
        item: 'grape1',
        zones: [
            [
                [-1871.85, 2096.73, 139.68],
                [-1915.77, 2102.04, 131.1],
                [-1911.11, 2154.06, 113.14],
                [-1885.06, 2168.62, 114.58],
                [-1865.37, 2168.76, 116.59],
                [-1836.61, 2154.18, 115.13],
                [-1846.81, 2125.8, 128.98],
            ],
            [
                [-1865.56, 2094.32, 138.71],
                [-1839.72, 2126.85, 126.11],
                [-1830.0, 2148.44, 117.63],
                [-1752.45, 2153.37, 122.46],
                [-1795.58, 2122.2, 132.89],
                [-1825.3, 2107.91, 138.2],
            ],
            [
                [-1857.22, 2087.94, 139.76],
                [-1840.31, 2064.19, 137.82],
                [-1809.84, 2060.25, 131.7],
                [-1787.7, 2072.71, 127.25],
                [-1725.23, 2129.73, 112.96],
                [-1683.7, 2159.84, 108.24],
                [-1752.54, 2143.48, 124.84],
                [-1799.75, 2114.22, 134.47],
                [-1827.21, 2104.17, 137.95],
            ],
            [
                [-1827.85, 2157.13, 115.01],
                [-1706.24, 2161.83, 113.81],
                [-1673.95, 2174.04, 104.61],
                [-1668.41, 2190.95, 99.42],
                [-1757.24, 2222.6, 93.85],
                [-1795.7, 2223.11, 90.28],
                [-1821.52, 2208.87, 90.23],
                [-1813.88, 2183.73, 100.71],
            ],
            [
                [-1898.9, 2179.73, 106.12],
                [-1835.76, 2167.8, 112.54],
                [-1823.58, 2185.95, 100.53],
                [-1835.82, 2213.02, 87.76],
                [-1861.25, 2227.33, 88.23],
                [-1885.35, 2231.39, 86.59],
                [-1902.16, 2227.31, 84.0],
            ],
            [
                [-1833.85, 2228.59, 82.92],
                [-1828.83, 2267.63, 71.48],
                [-1844.77, 2279.71, 72.2],
                [-1872.21, 2283.27, 69.41],
                [-1903.37, 2273.18, 66.56],
                [-1902.7, 2240.77, 80.5],
            ],
            [
                [-1739.97, 2232.94, 91.14],
                [-1742.05, 2262.85, 82.7],
                [-1763.4, 2275.6, 78.54],
                [-1798.04, 2276.11, 72.99],
                [-1824.42, 2258.36, 72.14],
                [-1828.19, 2222.89, 84.84],
                [-1814.31, 2222.92, 86.47],
                [-1793.29, 2231.44, 89.06],
            ],
        ],
    },
    [FoodFieldType.Muscat]: {
        capacity: { start: 800, max: 1200 },
        harvest: { delay: 10_000, min: 3, max: 5 },
        refill: {
            delay: 60_000,
            amount: 2,
        },
        item: 'grape2',
        zones: [
            [
                [-1678.38, 2243.62, 84.45],
                [-1693.58, 2261.61, 77.39],
                [-1678.81, 2290.24, 64.74],
                [-1636.86, 2321.15, 52.59],
                [-1597.79, 2321.38, 59.95],
                [-1592.72, 2310.06, 61.83],
                [-1594.94, 2267.92, 69.13],
                [-1571.96, 2239.93, 68.54],
                [-1572.89, 2188.84, 71.63],
                [-1606.76, 2186.55, 83.21],
                [-1647.72, 2231.46, 87.61],
            ],
            [
                [-1695.96, 2285.13, 69.05],
                [-1652.74, 2331.4, 50.54],
                [-1702.62, 2368.64, 49.58],
                [-1749.69, 2386.66, 44.8],
                [-1808.51, 2350.73, 45.04],
                [-1804.08, 2334.4, 50.5],
                [-1728.63, 2304.14, 74.21],
                [-1718.46, 2294.02, 74.55],
            ],
        ],
    },
    [FoodFieldType.Centennial]: {
        capacity: { start: 800, max: 1200 },
        harvest: { delay: 10_000, min: 3, max: 5 },
        refill: {
            delay: 60_000,
            amount: 2,
        },
        item: 'grape3',
        zones: [
            [
                [-1683.7, 1947.37, 135.99],
                [-1685.07, 1987.72, 129.03],
                [-1688.2, 2038.36, 113.13],
                [-1713.76, 2042.82, 111.11],
                [-1738.22, 2000.17, 117.83],
                [-1739.66, 1972.64, 121.04],
                [-1700.58, 1917.88, 148.68],
            ],
            [
                [-1790.51, 1928.98, 131.69],
                [-1780.74, 1892.72, 148.59],
                [-1762.62, 1885.49, 153.12],
                [-1710.42, 1885.7, 161.43],
                [-1703.07, 1902.72, 154.19],
                [-1723.41, 1931.36, 136.49],
                [-1728.24, 1949.47, 127.65],
                [-1751.85, 1982.13, 117.59],
                [-1778.08, 1949.03, 126.84],
            ],
        ],
    },
    [FoodFieldType.Chasselas]: {
        capacity: { start: 800, max: 1200 },
        harvest: { delay: 10_000, min: 3, max: 5 },
        refill: {
            delay: 60_000,
            amount: 2,
        },
        item: 'grape4',
        zones: [
            [
                [-1856.86, 1931.54, 149.57],
                [-1898.45, 1970.04, 143.84],
                [-1971.52, 1964.08, 156.39],
                [-1982.89, 1955.89, 164.48],
                [-1983.58, 1942.88, 169.52],
                [-1944.91, 1919.17, 172.67],
                [-1936.74, 1905.66, 175.99],
                [-1923.77, 1895.83, 174.57],
                [-1888.29, 1909.69, 163.42],
            ],
            [
                [-1851.0, 1924.08, 150.91],
                [-1890.64, 1902.23, 165.86],
                [-1912.73, 1894.81, 172.56],
                [-1937.88, 1876.32, 180.87],
                [-1952.49, 1839.34, 180.56],
                [-1946.66, 1822.47, 172.59],
                [-1838.28, 1900.16, 145.2],
            ],
        ],
    },
};

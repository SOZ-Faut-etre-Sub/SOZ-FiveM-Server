import { WardrobeConfig } from '../cloth';
import { NamedZone } from '../polyzone/box.zone';

export type FoodRecipe = {
    canCraft: boolean;
    inputs: {
        label: string;
        hasRequiredAmount: boolean;
        amount: number;
    }[];
    output: {
        label: string;
        amount: number;
    };
};

export type FoodCraftProcess = {
    inputs: {
        id: string;
        amount: number;
    }[];
    output: {
        id: string;
        amount: number;
    };
};

const wineCraftZones: NamedZone[] = [
    {
        name: 'food_craft_wine',
        center: [-1887.8, 2063.9, 141.0],
        length: 0.4,
        width: 1.4,
        heading: 340,
        minZ: 140.0,
        maxZ: 142.0,
    },
];

const wineProcesses: FoodCraftProcess[] = [
    {
        inputs: [{ id: 'grape1', amount: 10 }],
        output: { id: 'wine1', amount: 1 },
    },
    {
        inputs: [{ id: 'grape2', amount: 10 }],
        output: { id: 'wine2', amount: 1 },
    },
    {
        inputs: [{ id: 'grape3', amount: 10 }],
        output: { id: 'wine3', amount: 1 },
    },
    {
        inputs: [{ id: 'grape4', amount: 10 }],
        output: { id: 'wine4', amount: 1 },
    },
];

// No craft zone for juice as it's the same as wine for now.

const juiceProcesses: FoodCraftProcess[] = [
    {
        inputs: [{ id: 'grape1', amount: 4 }],
        output: { id: 'grapejuice1', amount: 4 },
    },
    {
        inputs: [{ id: 'grape2', amount: 4 }],
        output: { id: 'grapejuice2', amount: 4 },
    },
    {
        inputs: [{ id: 'grape3', amount: 4 }],
        output: { id: 'grapejuice3', amount: 4 },
    },
    {
        inputs: [
            { id: 'grape1', amount: 2 },
            { id: 'grape2', amount: 2 },
            { id: 'grape3', amount: 2 },
            { id: 'grape4', amount: 2 },
        ],
        output: { id: 'grapejuice4', amount: 4 },
    },
    {
        inputs: [{ id: 'grape4', amount: 4 }],
        output: { id: 'grapejuice5', amount: 4 },
    },
];

const cheeseCraftZones: NamedZone[] = [
    {
        name: 'food_craft_cheese',
        center: [-1882.53, 2069.2, 141.0],
        length: 2.2,
        width: 1.15,
        heading: 340,
        minZ: 140.0,
        maxZ: 141.45,
    },
];

const cheeseProcesses: FoodCraftProcess[] = [
    {
        inputs: [{ id: 'skimmed_milk', amount: 1 }],
        output: { id: 'cheese1', amount: 3 },
    },
    {
        inputs: [{ id: 'milk', amount: 1 }],
        output: { id: 'cheese2', amount: 3 },
    },
    {
        inputs: [{ id: 'milk', amount: 1 }],
        output: { id: 'cheese3', amount: 3 },
    },
    {
        inputs: [{ id: 'semi_skimmed_milk', amount: 1 }],
        output: { id: 'cheese4', amount: 3 },
    },
    {
        inputs: [{ id: 'semi_skimmed_milk', amount: 1 }],
        output: { id: 'cheese5', amount: 3 },
    },
    {
        inputs: [{ id: 'semi_skimmed_milk', amount: 1 }],
        output: { id: 'cheese6', amount: 3 },
    },
    {
        inputs: [{ id: 'milk', amount: 1 }],
        output: { id: 'cheese7', amount: 3 },
    },
    {
        inputs: [{ id: 'skimmed_milk', amount: 1 }],
        output: { id: 'cheese8', amount: 3 },
    },
    {
        inputs: [{ id: 'skimmed_milk', amount: 1 }],
        output: { id: 'cheese9', amount: 3 },
    },
];

const sausageCraftZones: NamedZone[] = [
    {
        name: 'food_craft_sausage',
        center: [-1880.22, 2068.34, 141.0],
        length: 2.15,
        width: 1.15,
        heading: 340,
        minZ: 140.0,
        maxZ: 141.45,
    },
];

const sausageProcesses: FoodCraftProcess[] = [
    {
        inputs: [
            { id: 'abat', amount: 4 },
            { id: 'langue', amount: 4 },
            { id: 'rognon', amount: 4 },
            { id: 'tripe', amount: 4 },
            { id: 'viande', amount: 4 },
        ],
        output: { id: 'sausage1', amount: 4 },
    },
    {
        inputs: [
            { id: 'abat', amount: 4 },
            { id: 'langue', amount: 4 },
            { id: 'rognon', amount: 4 },
            { id: 'tripe', amount: 4 },
            { id: 'viande', amount: 4 },
        ],
        output: { id: 'sausage2', amount: 4 },
    },
    {
        inputs: [
            { id: 'abat', amount: 4 },
            { id: 'langue', amount: 4 },
            { id: 'rognon', amount: 4 },
            { id: 'tripe', amount: 4 },
            { id: 'viande', amount: 4 },
        ],
        output: { id: 'sausage3', amount: 4 },
    },
    {
        inputs: [
            { id: 'abat', amount: 4 },
            { id: 'langue', amount: 4 },
            { id: 'rognon', amount: 4 },
            { id: 'tripe', amount: 4 },
            { id: 'viande', amount: 4 },
        ],
        output: { id: 'sausage4', amount: 4 },
    },
    {
        inputs: [
            { id: 'abat', amount: 4 },
            { id: 'langue', amount: 4 },
            { id: 'rognon', amount: 4 },
            { id: 'tripe', amount: 4 },
            { id: 'viande', amount: 4 },
        ],
        output: { id: 'sausage5', amount: 4 },
    },
    {
        inputs: [
            { id: 'chocolat_egg', amount: 2 },
            { id: 'chocolat_milk_egg', amount: 2 },
        ],
        output: { id: 'easter_basket', amount: 1 },
    },
];

const easterProcesses: FoodCraftProcess[] = [
    {
        inputs: [
            { id: 'chocolat_egg', amount: 2 },
            { id: 'chocolat_milk_egg', amount: 2 },
        ],
        output: { id: 'easter_basket', amount: 1 },
    },
];

export const FoodConfig = {
    duration: {
        default: 4000,
        craftSausage: 8000,
        craftWine: 20000,
        craftCheese: 6000,
        craftJuice: 8000,
        craftEaster: 5000,
    },
    zones: {
        wineCraftZones,
        cheeseCraftZones,
        sausageCraftZones,
    },
    processes: {
        juiceProcesses,
        wineProcesses,
        cheeseProcesses,
        sausageProcesses,
        easterProcesses,
    },
};

export const FoodCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Tenue de Direction']: {
            Components: {
                [3]: { Drawable: 6, Texture: 0, Palette: 0 },
                [4]: { Drawable: 24, Texture: 0, Palette: 0 },
                [6]: { Drawable: 104, Texture: 4, Palette: 0 },
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
                [11]: { Drawable: 0, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de prestation']: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [4]: { Drawable: 35, Texture: 0, Palette: 0 },
                [6]: { Drawable: 20, Texture: 3, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 25, Texture: 3, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 4, Texture: 0, Palette: 0 },
            },
            Props: {},
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
                [3]: { Drawable: 12, Texture: 0, Palette: 0 },
                [4]: { Drawable: 86, Texture: 6, Palette: 0 },
                [6]: { Drawable: 63, Texture: 4, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 0, Texture: 20, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 220, Texture: 6, Palette: 0 },
            },
            Props: {},
        },
    },

    [GetHashKey('mp_f_freemode_01')]: {
        ['Tenue de Direction']: {
            Components: {
                [3]: { Drawable: 3, Texture: 0, Palette: 0 },
                [4]: { Drawable: 37, Texture: 0, Palette: 0 },
                [6]: { Drawable: 42, Texture: 2, Palette: 0 },
                [7]: { Drawable: 87, Texture: 4, Palette: 0 },
                [8]: { Drawable: 38, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 7, Texture: 0, Palette: 0 },
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
                [11]: { Drawable: 73, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de prestation']: {
            Components: {
                [3]: { Drawable: 3, Texture: 0, Palette: 0 },
                [4]: { Drawable: 34, Texture: 0, Palette: 0 },
                [6]: { Drawable: 29, Texture: 1, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 40, Texture: 7, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 7, Texture: 0, Palette: 0 },
            },
            Props: {},
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
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [4]: { Drawable: 89, Texture: 6, Palette: 0 },
                [6]: { Drawable: 66, Texture: 4, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 229, Texture: 19, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 230, Texture: 6, Palette: 0 },
            },
            Props: {},
        },
    },
};

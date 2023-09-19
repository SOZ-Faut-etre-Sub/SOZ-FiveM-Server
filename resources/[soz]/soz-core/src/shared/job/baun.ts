import { WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
import { NamedZone } from '../polyzone/box.zone';

export const baunCraftZones: NamedZone[] = [
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

export const BaunCraftsLists: Record<string, CraftCategory> = {
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

export const BaunConfig = {
    Resell: {
        duration: 2000,
        reward: 1000,
    },
    DURATIONS: {
        CRAFTING: 4000,
        RESTOCKING: 4000,
        HARVESTING: 2000,
    },
};

export const BaunCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Tenue de travail']: {
            Components: {
                [3]: { Drawable: 61, Texture: 0, Palette: 0 },
                [4]: { Drawable: 1, Texture: 1, Palette: 0 },
                [6]: { Drawable: 4, Texture: 4, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 23, Texture: 1, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 230, Texture: 7, Palette: 0 },
            },
            Props: { [0]: { Drawable: 58, Texture: 2, Palette: 0 } },
        },
        ['Tenue de service']: {
            Components: {
                [3]: { Drawable: 11, Texture: 0, Palette: 0 },
                [4]: { Drawable: 35, Texture: 0, Palette: 0 },
                [6]: { Drawable: 21, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 93, Texture: 1, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 11, Texture: 14, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 24, Texture: 0, Palette: 0 },
                [6]: { Drawable: 20, Texture: 7, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 139, Texture: 1, Palette: 0 },
            },
            Props: { [0]: { Drawable: 61, Texture: 4, Palette: 0 } },
        },
        ['Tenue de la direction']: {
            Components: {
                [3]: { Drawable: 1, Texture: 0, Palette: 0 },
                [4]: { Drawable: 25, Texture: 2, Palette: 0 },
                [6]: { Drawable: 21, Texture: 0, Palette: 0 },
                [7]: { Drawable: 24, Texture: 2, Palette: 0 },
                [8]: { Drawable: 26, Texture: 3, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 4, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de patron']: {
            Components: {
                [3]: { Drawable: 83, Texture: 0, Palette: 0 },
                [4]: { Drawable: 143, Texture: 8, Palette: 0 },
                [6]: { Drawable: 18, Texture: 0, Palette: 0 },
                [7]: { Drawable: 143, Texture: 2, Palette: 0 },
                [8]: { Drawable: 15, Texture: 20, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 70, Texture: 5, Palette: 0 },
            },
            Props: {
                [0]: { Drawable: 25, Texture: 2, Palette: 0 },
                [1]: { Drawable: 12, Texture: 0, Palette: 0 },
            },
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Tenue de travail']: {
            Components: {
                [3]: { Drawable: 19, Texture: 0, Palette: 0 },
                [4]: { Drawable: 4, Texture: 0, Palette: 0 },
                [6]: { Drawable: 3, Texture: 2, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 52, Texture: 1, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 240, Texture: 7, Palette: 0 },
            },
            Props: { [0]: { Drawable: 58, Texture: 2, Palette: 0 } },
        },
        ['Tenue de service']: {
            Components: {
                [3]: { Drawable: 4, Texture: 0, Palette: 0 },
                [4]: { Drawable: 6, Texture: 0, Palette: 0 },
                [6]: { Drawable: 42, Texture: 2, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 26, Texture: 2, Palette: 0 },
            },
            Props: { [0]: { Drawable: 120, Texture: 0, Palette: 0 } },
        },
        ["Tenue d'hiver"]: {
            Components: {
                [3]: { Drawable: 36, Texture: 0, Palette: 0 },
                [4]: { Drawable: 133, Texture: 0, Palette: 0 },
                [6]: { Drawable: 42, Texture: 4, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 103, Texture: 1, Palette: 0 },
            },
            Props: { [0]: { Drawable: 14, Texture: 0, Palette: 0 } },
        },
        ['Tenue de la direction']: {
            Components: {
                [3]: { Drawable: 7, Texture: 0, Palette: 0 },
                [4]: { Drawable: 76, Texture: 0, Palette: 0 },
                [6]: { Drawable: 20, Texture: 2, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 25, Texture: 4, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 25, Texture: 7, Palette: 0 },
            },
            Props: { [0]: { Drawable: 120, Texture: 0, Palette: 0 } },
        },
        ['Tenue de patron']: {
            Components: {
                [3]: { Drawable: 12, Texture: 0, Palette: 0 },
                [4]: { Drawable: 15, Texture: 0, Palette: 0 },
                [6]: { Drawable: 42, Texture: 2, Palette: 0 },
                [7]: { Drawable: 64, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 415, Texture: 0, Palette: 0 },
            },
            Props: {
                [0]: { Drawable: 61, Texture: 2, Palette: 0 },
                [1]: { Drawable: 11, Texture: 4, Palette: 0 },
                [6]: { Drawable: 19, Texture: 4, Palette: 0 },
                [7]: { Drawable: 16, Texture: 0, Palette: 0 },
            },
        },
    },
};

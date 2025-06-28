import { WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
import { Feature } from '../features';
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
    {
        name: 'baun:rooftop:craft:1',
        center: [-1374.88, -628.81, 43.44],
        length: 0.2,
        width: 0.2,
        heading: 226.08,
        minZ: 43.24,
        maxZ: 43.64,
    },
];

export const BaunCraftsLists: Record<string, CraftCategory> = {
    Cocktails: {
        animation: {
            dictionary: 'anim@amb@nightclub@mini@drinking@drinking_shots@ped_a@normal',
            name: 'pour_one',
            options: {
                repeat: true,
            },
        },
        duration: 4000,
        event: 'job_baun_craft',
        recipes: {
            narito: {
                amount: 1,
                inputs: {
                    rhum: { count: 1 },
                    cane_sugar: { count: 2 },
                    green_lemon: { count: 2 },
                    fruit_slice: { count: 4 },
                    ice_cube: { count: 8 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            lapicolada: {
                amount: 1,
                inputs: {
                    rhum: { count: 1 },
                    coconut_milk: { count: 3 },
                    ananas_juice: { count: 2 },
                    fruit_slice: { count: 4 },
                    ice_cube: { count: 6 },
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
                    fruit_slice: { count: 4 },
                    cane_sugar: { count: 2 },
                    ice_cube: { count: 6 },
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
                    cane_sugar: { count: 2 },
                    ice_cube: { count: 4 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            pinkenny: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    green_lemon: { count: 1 },
                    strawberry_juice: { count: 2 },
                    apple_juice: { count: 3 },
                    cane_sugar: { count: 2 },
                    ice_cube: { count: 4 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            phasmopolitan: {
                amount: 1,
                inputs: {
                    gin: { count: 1 },
                    green_lemon: { count: 1 },
                    ice_cube: { count: 4 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            escalier: {
                amount: 1,
                inputs: {
                    cognac: { count: 1 },
                    orange_juice: { count: 2 },
                    ice_cube: { count: 2 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            whicanelle: {
                amount: 1,
                inputs: {
                    whisky: { count: 1 },
                    apple_juice: { count: 2 },
                    green_lemon: { count: 1 },
                    cane_sugar: { count: 2 },
                    ice_cube: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            feur: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    strawberry_juice: { count: 2 },
                    green_lemon: { count: 2 },
                    ice_cube: { count: 6 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            pinata: {
                amount: 1,
                inputs: {
                    rhum: { count: 1 },
                    ananas_juice: { count: 2 },
                    coconut_milk: { count: 2 },
                    cane_sugar: { count: 2 },
                    fruit_slice: { count: 4 },
                    ice_cube: { count: 2 },
                    skimmed_milk: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            mafracas: {
                amount: 1,
                inputs: {
                    tequila: { count: 1 },
                    ananas_juice: { count: 3 },
                    strawberry_juice: { count: 1 },
                    green_lemon: { count: 1 },
                    fruit_slice: { count: 4 },
                    ice_cube: { count: 4 },
                    skimmed_milk: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            irish_coffee: {
                amount: 1,
                inputs: {
                    whisky: { count: 1 },
                    coffee: { count: 1 },
                    cane_sugar: { count: 2 },
                    semi_skimmed_milk: { count: 1 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
        },
    },
    'Cocktails sans alcool': {
        animation: {
            dictionary: 'anim@amb@nightclub@mini@drinking@drinking_shots@ped_a@normal',
            name: 'pour_one',
            options: {
                repeat: true,
            },
        },
        duration: 4000,
        event: 'job_baun_craft',
        recipes: {
            iced_coffee: {
                amount: 1,
                inputs: {
                    coffee: { count: 1 },
                    semi_skimmed_milk: { count: 1 },
                    ice_cube: { count: 8 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            strawberry_milkshake: {
                amount: 1,
                inputs: {
                    strawberry_juice: { count: 2 },
                    milk: { count: 1 },
                    cane_sugar: { count: 2 },
                    fruit_slice: { count: 4 },
                    ice_cube: { count: 6 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            coconut_milkshake: {
                amount: 1,
                inputs: {
                    coconut_milk: { count: 2 },
                    milk: { count: 1 },
                    cane_sugar: { count: 2 },
                    ice_cube: { count: 6 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            virgin_narito: {
                amount: 1,
                inputs: {
                    lemonade_bottle: { count: 1 },
                    cane_sugar: { count: 2 },
                    green_lemon: { count: 2 },
                    fruit_slice: { count: 4 },
                    ice_cube: { count: 8 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            acidifer: {
                amount: 1,
                inputs: {
                    lemonade_bottle: { count: 1 },
                    orange_juice: { count: 2 },
                    ananas_juice: { count: 2 },
                    green_lemon: { count: 2 },
                    ice_cube: { count: 2 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
            fraisetival: {
                amount: 1,
                inputs: {
                    lemonade_bottle: { count: 1 },
                    strawberry_juice: { count: 1 },
                    ananas_juice: { count: 1 },
                    orange_juice: { count: 1 },
                    green_lemon: { count: 1 },
                    ice_cube: { count: 4 },
                    straw: { count: 1 },
                    tumbler: { count: 1 },
                },
            },
        },
    },
    Boissons: {
        animation: {
            dictionary: 'anim@amb@nightclub@mini@drinking@drinking_shots@ped_a@normal',
            name: 'pour_one',
            options: {
                repeat: true,
            },
        },
        duration: 4000,
        event: 'job_baun_craft',
        recipes: {
            lemonade_glass: {
                amount: 4,
                inputs: {
                    lemonade_bottle: { count: 1 },
                },
            },
        },
    },
    Halloween: {
        animation: {
            dictionary: 'anim@amb@nightclub@mini@drinking@drinking_shots@ped_a@normal',
            name: 'pour_one',
            options: {
                repeat: true,
            },
        },
        feature: Feature.Halloween,
        duration: 4000,
        icon: '🎃',
        event: 'job_baun_craft',
        recipes: {
            surprise_candie: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                },
            },
            horror_cauldron: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                },
            },
            halloween_radioactive_beer: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                    halloween_uranium_raw: { count: 1 },
                },
            },
            halloween_bloody_mary: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                },
            },
            halloween_spectral_elixir: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                },
            },
            halloween_alice_blood: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                    halloween_pure_blood: { count: 1 },
                },
            },
            halloween_mortal_kiss: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                    halloween_pure_blood: { count: 1 },
                },
            },
            halloween_scarlet_nectar: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                    halloween_pure_blood: { count: 1 },
                },
            },
            halloween_twilight_chalice: {
                amount: 1,
                inputs: {
                    vodka: { count: 1 },
                    gin: { count: 1 },
                    tequila: { count: 1 },
                    whisky: { count: 1 },
                    cognac: { count: 1 },
                    rhum: { count: 1 },
                    halloween_pure_blood: { count: 1 },
                },
            },
        },
    },
};

export const BaunConfig = {
    Resell: {
        duration: 2000,
        reward: 2000,
    },
    DURATIONS: {
        RESTOCKING: 4000,
        HARVESTING: 2000,
    },
};

export const BaunCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Tenue de travail']: {
            Components: {
                [3]: { Drawable: 26, Texture: 0, Palette: 0 },
                [4]: { Drawable: 148, Texture: 3, Palette: 0 },
                [5]: { Drawable: 81, Texture: 1, Palette: 0 },
                [6]: { Drawable: 114, Texture: 22, Palette: 0 },
                [8]: { Drawable: 0, Texture: 4, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 347, Texture: 21, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue chill ']: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [4]: { Drawable: 26, Texture: 6, Palette: 0 },
                [6]: { Drawable: 145, Texture: 10, Palette: 0 },
                [8]: { Drawable: 0, Texture: 4, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 346, Texture: 25, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue chic']: {
            Components: {
                [3]: { Drawable: 6, Texture: 0, Palette: 0 },
                [4]: { Drawable: 49, Texture: 0, Palette: 0 },
                [6]: { Drawable: 104, Texture: 3, Palette: 0 },
                [8]: { Drawable: 157, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 11, Texture: 7, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de la direction']: {
            Components: {
                [3]: { Drawable: 1, Texture: 0, Palette: 0 },
                [4]: { Drawable: 49, Texture: 0, Palette: 0 },
                [5]: { Drawable: 85, Texture: 21, Palette: 0 },
                [6]: { Drawable: 10, Texture: 7, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 349, Texture: 12, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue été']: {
            Components: {
                [3]: { Drawable: 198, Texture: 0, Palette: 0 },
                [4]: { Drawable: 12, Texture: 12, Palette: 0 },
                [6]: { Drawable: 114, Texture: 23, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 404, Texture: 23, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [3]: { Drawable: 33, Texture: 0, Palette: 0 },
                [4]: { Drawable: 24, Texture: 0, Palette: 0 },
                [6]: { Drawable: 20, Texture: 7, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 139, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Tenue de travail']: {
            Components: {
                [3]: { Drawable: 6, Texture: 0, Palette: 0 },
                [4]: { Drawable: 4, Texture: 2, Palette: 0 },
                [6]: { Drawable: 119, Texture: 17, Palette: 0 },
                [8]: { Drawable: 16, Texture: 2, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 547, Texture: 9, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue chill']: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [4]: { Drawable: 4, Texture: 2, Palette: 0 },
                [6]: { Drawable: 118, Texture: 16, Palette: 0 },
                [8]: { Drawable: 151, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 448, Texture: 16, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue chic avec talons']: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [4]: { Drawable: 133, Texture: 16, Palette: 0 },
                [6]: { Drawable: 6, Texture: 2, Palette: 0 },
                [8]: { Drawable: 193, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 334, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue chic sans talons']: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [4]: { Drawable: 133, Texture: 16, Palette: 0 },
                [6]: { Drawable: 108, Texture: 3, Palette: 0 },
                [8]: { Drawable: 193, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 334, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de la direction']: {
            Components: {
                [3]: { Drawable: 5, Texture: 0, Palette: 0 },
                [4]: { Drawable: 50, Texture: 0, Palette: 0 },
                [6]: { Drawable: 6, Texture: 2, Palette: 0 },
                [8]: { Drawable: 13, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 24, Texture: 6, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue été']: {
            Components: {
                [3]: { Drawable: 12, Texture: 0, Palette: 0 },
                [4]: { Drawable: 15, Texture: 0, Palette: 0 },
                [6]: { Drawable: 119, Texture: 17, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 415, Texture: 23, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [3]: { Drawable: 36, Texture: 0, Palette: 0 },
                [4]: { Drawable: 133, Texture: 0, Palette: 0 },
                [6]: { Drawable: 108, Texture: 11, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 103, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
    },
};

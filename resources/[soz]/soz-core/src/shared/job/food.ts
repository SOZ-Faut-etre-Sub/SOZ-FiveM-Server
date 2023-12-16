import { WardrobeConfig } from '../cloth';
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
        center: [-1882.53, 2069.2, 141.0],
        length: 2.2,
        width: 1.15,
        heading: 340,
        minZ: 140.0,
        maxZ: 141.45,
    },
    {
        name: 'food_craft_2',
        center: [-1880.22, 2068.34, 141.0],
        length: 2.15,
        width: 1.15,
        heading: 340,
        minZ: 140.0,
        maxZ: 141.45,
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
        feature: Feature.Easter,
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

    [joaat('mp_f_freemode_01')]: {
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

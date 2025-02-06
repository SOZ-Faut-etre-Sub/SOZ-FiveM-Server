import { Feature } from '../features';
import { CraftCategory } from './craft';

export const PawlCraftsLists: Record<string, CraftCategory> = {
    Objets: {
        duration: 15000,
        animation: {
            dictionary: 'mp_arresting',
            name: 'a_uncuff',
            options: {
                onlyUpperBody: true,
                repeat: true,
            },
        },
        event: 'job_pawl_craft',
        recipes: {
            police_barrier: {
                inputs: {
                    wood_plank: { count: 1 },
                },
                amount: 1,
            },
            paper: {
                inputs: {
                    wood_plank: { count: 1 },
                },
                amount: 10,
            },
            empty_lunchbox: {
                inputs: {
                    wood_plank: { count: 1 },
                },
                amount: 4,
            },
            cabinet_zkea: {
                inputs: {
                    wood_plank: { count: 2 },
                },
                rewardTier: {
                    Divin: { id: 4, chance: GetConvarInt('soz_pawl_craft_chance_tier_4', 25) },
                    Sublime: { id: 3, chance: GetConvarInt('soz_pawl_craft_chance_tier_3', 25) },
                    Joli: { id: 2, chance: GetConvarInt('soz_pawl_craft_chance_tier_2', 25) },
                    Banal: { id: 1, chance: GetConvarInt('soz_pawl_craft_chance_tier_1', 25) },
                },
                amount: 1,
            },
            walkstick: {
                inputs: {
                    wood_plank: { count: 1 },
                },
                amount: 4,
            },
        },
    },
    Halloween: {
        feature: Feature.Halloween,
        duration: 15000,
        icon: '🎃',
        animation: {
            dictionary: 'mp_arresting',
            name: 'a_uncuff',
            options: {
                onlyUpperBody: true,
                repeat: true,
            },
        },
        event: 'job_pawl_craft',
        recipes: {
            witch_broom: {
                inputs: {
                    wood_plank: { count: 4 },
                },
                amount: 1,
            },
            small_coffin: {
                inputs: {
                    wood_plank: { count: 10 },
                },
                amount: 1,
            },
            halloween_scarecrow: {
                inputs: {
                    wood_plank: { count: 10 },
                    halloween_uranium_raw: { count: 1 },
                },
                amount: 1,
            },
            halloween_wooden_stake: {
                inputs: {
                    wood_plank: { count: 1 },
                    halloween_pure_blood: { count: 1 },
                },
                amount: 1,
            },
        },
    },
    ['Tenues']: {
        animation: {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            options: {
                repeat: true,
                onlyUpperBody: true,
            },
        },
        duration: 8000,
        icon: '⚒️',
        event: 'job_pawl_craft',
        recipes: {
            work_clothes: {
                amount: 4,
                inputs: {
                    wood_plank: { count: 1 },
                    sawdust: { count: 20 },
                    sap: { count: 3 },
                },
            },
        },
    },
};

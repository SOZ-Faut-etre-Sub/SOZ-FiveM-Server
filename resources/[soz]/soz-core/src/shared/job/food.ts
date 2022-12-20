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
];

export const FoodConfig = {
    duration: {
        default: 4000,
        craftSausage: 8000,
        craftWine: 20000,
        craftCheese: 6000,
        craftJuice: 8000,
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
    },
};

import { ZoneOptions } from '../../client/target/target.factory';

export const BaunConfig = {
    DURATIONS: {
        CRAFTING: 4000,
        RESTOCKING: 4000,
        HARVESTING: 2000,
    },
};

export type BaunCraftProcess = {
    inputs: {
        id: string;
        amount: number;
    }[];
    output: {
        id: string;
        amount: number;
    };
};

export const baunCraftZones: (ZoneOptions & { name: string })[] = [
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
];

export const baunCraftProcesses: BaunCraftProcess[] = [
    {
        inputs: [
            { id: 'rhum', amount: 1 },
            { id: 'cane_sugar', amount: 2 },
            { id: 'green_lemon', amount: 2 },
            { id: 'fruit_slice', amount: 4 },
            { id: 'ice_cube', amount: 8 },
            { id: 'straw', amount: 1 },
            { id: 'tumbler', amount: 1 },
        ],
        output: {
            id: 'narito',
            amount: 1,
        },
    },
    {
        inputs: [
            { id: 'rhum', amount: 1 },
            { id: 'coconut_milk', amount: 3 },
            { id: 'ananas_juice', amount: 2 },
            { id: 'fruit_slice', amount: 4 },
            { id: 'ice_cube', amount: 6 },
            { id: 'straw', amount: 1 },
            { id: 'tumbler', amount: 1 },
        ],
        output: {
            id: 'lapicolada',
            amount: 1,
        },
    },
    {
        inputs: [
            { id: 'tequila', amount: 1 },
            { id: 'orange_juice', amount: 1 },
            { id: 'strawberry_juice', amount: 1 },
            { id: 'fruit_slice', amount: 4 },
            { id: 'cane_sugar', amount: 2 },
            { id: 'ice_cube', amount: 6 },
            { id: 'straw', amount: 1 },
            { id: 'tumbler', amount: 1 },
        ],
        output: {
            id: 'sunrayou',
            amount: 1,
        },
    },
    {
        inputs: [
            { id: 'rhum', amount: 1 },
            { id: 'orange_juice', amount: 1 },
            { id: 'ananas_juice', amount: 1 },
            { id: 'cane_sugar', amount: 2 },
            { id: 'ice_cube', amount: 4 },
            { id: 'straw', amount: 1 },
            { id: 'tumbler', amount: 1 },
        ],
        output: {
            id: 'ponche',
            amount: 1,
        },
    },
    {
        inputs: [
            { id: 'vodka', amount: 1 },
            { id: 'green_lemon', amount: 1 },
            { id: 'strawberry_juice', amount: 2 },
            { id: 'apple_juice', amount: 3 },
            { id: 'cane_sugar', amount: 2 },
            { id: 'ice_cube', amount: 4 },
            { id: 'straw', amount: 1 },
            { id: 'tumbler', amount: 1 },
        ],
        output: {
            id: 'pinkenny',
            amount: 1,
        },
    },
    {
        inputs: [
            { id: 'gin', amount: 1 },
            { id: 'green_lemon', amount: 1 },
            { id: 'ice_cube', amount: 4 },
            { id: 'straw', amount: 1 },
            { id: 'tumbler', amount: 1 },
        ],
        output: {
            id: 'phasmopolitan',
            amount: 1,
        },
    },
    {
        inputs: [
            { id: 'cognac', amount: 1 },
            { id: 'orange_juice', amount: 2 },
            { id: 'ice_cube', amount: 2 },
            { id: 'straw', amount: 1 },
            { id: 'tumbler', amount: 1 },
        ],
        output: {
            id: 'escalier',
            amount: 1,
        },
    },
    {
        inputs: [
            { id: 'whisky', amount: 1 },
            { id: 'apple_juice', amount: 2 },
            { id: 'green_lemon', amount: 1 },
            { id: 'cane_sugar', amount: 2 },
            { id: 'ice_cube', amount: 1 },
            { id: 'straw', amount: 1 },
            { id: 'tumbler', amount: 1 },
        ],
        output: {
            id: 'whicanelle',
            amount: 1,
        },
    },
];

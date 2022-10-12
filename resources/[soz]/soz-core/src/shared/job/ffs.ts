import { ZoneOptions } from '../../client/target/target.factory';

export enum SewingRawMaterial {
    COTTON_BALE = 'cotton_bale',
    REFINED_PETROLEUM = 'petroleum_refined',
    WOOD_PLANK = 'wood_plank',
    SKIN = 'peau',
    SAP = 'sap',
}

export enum FabricMaterial {
    NATURAL_FIBER = 'natural_fiber',
    SYNTHETIC_FIBER = 'synthetic_fiber',
    ARTIFICIAL_FIBER = 'artificial_fiber',
    LEATHER = 'leather',
    LATEX = 'latex',
}

export type TransformProcess = {
    input: SewingRawMaterial;
    inputAmount: number;
    output: FabricMaterial;
    outputAmount: number;
};

const transformProcesses: {
    [key in FabricMaterial]: TransformProcess;
} = {
    [FabricMaterial.NATURAL_FIBER]: {
        input: SewingRawMaterial.COTTON_BALE,
        inputAmount: 1,
        output: FabricMaterial.NATURAL_FIBER,
        outputAmount: 120,
    },
    [FabricMaterial.SYNTHETIC_FIBER]: {
        input: SewingRawMaterial.REFINED_PETROLEUM,
        inputAmount: 1,
        output: FabricMaterial.SYNTHETIC_FIBER,
        outputAmount: 20,
    },
    [FabricMaterial.ARTIFICIAL_FIBER]: {
        input: SewingRawMaterial.WOOD_PLANK,
        inputAmount: 1,
        output: FabricMaterial.ARTIFICIAL_FIBER,
        outputAmount: 20,
    },
    [FabricMaterial.LEATHER]: {
        input: SewingRawMaterial.SKIN,
        inputAmount: 1,
        output: FabricMaterial.LEATHER,
        outputAmount: 8,
    },
    [FabricMaterial.LATEX]: {
        input: SewingRawMaterial.SAP,
        inputAmount: 5,
        output: FabricMaterial.LATEX,
        outputAmount: 2,
    },
};

export enum Garment {
    TOP = 'garment_top',
    PANT = 'garment_pant',
    SHOES = 'garment_shoes',
    UNDERWEAR = 'garment_underwear',
}

export enum LuxuryGarment {
    TOP = 'luxury_garment_top',
    PANT = 'luxury_garment_pant',
    SHOES = 'luxury_garment_shoes',
    UNDERWEAR = 'luxury_garment_underwear',
}

export type CraftProcess = {
    label: string;
    inputs: {
        id: string;
        amount: number;
    }[];
    output: string;
    outputAmount: number;
};

const craftZones: (ZoneOptions & { name: string })[] = [
    {
        name: 'ffs_craft1',
        center: [713.6, -960.64, 30.4],
        length: 0.65,
        width: 0.3,
        minZ: 30.4,
        maxZ: 30.8,
        heading: 270,
        debugPoly: false,
    },
    {
        name: 'ffs_craft2',
        center: [716.17, -960.72, 30.4],
        length: 0.3,
        width: 0.7,
        minZ: 30.4,
        maxZ: 30.85,
        heading: 0,
        debugPoly: false,
    },
    {
        name: 'ffs_craft3',
        center: [718.7, -960.72, 30.4],
        length: 0.3,
        width: 0.7,
        minZ: 30.4,
        maxZ: 30.8,
        heading: 0,
        debugPoly: false,
    },
    {
        name: 'ffs_craft4',
        center: [715.97, -963.08, 30.4],
        length: 0.4,
        width: 0.7,
        minZ: 30.4,
        maxZ: 30.8,
        heading: 0,
        debugPoly: false,
    },
    {
        name: 'ffs_craft5',
        center: [718.69, -963.17, 30.4],
        length: 0.3,
        width: 0.7,
        minZ: 30.2,
        maxZ: 30.85,
        heading: 0,
        debugPoly: false,
    },
];

const craftProcesses: CraftProcess[] = [
    {
        label: 'Haut en fibre naturelle',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 40,
            },
        ],
        output: Garment.TOP,
        outputAmount: 1,
    },
    {
        label: 'Haut en fibre artificielle',
        inputs: [
            {
                id: FabricMaterial.ARTIFICIAL_FIBER,
                amount: 20,
            },
        ],
        output: Garment.TOP,
        outputAmount: 1,
    },
    {
        label: 'Pantalon synthétique',
        inputs: [
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 20,
            },
        ],
        output: Garment.PANT,
        outputAmount: 1,
    },
    {
        label: 'Pantalon naturel',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 40,
            },
        ],
        output: Garment.PANT,
        outputAmount: 1,
    },
    {
        label: 'Sous-vêtement',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 20,
            },
        ],
        output: Garment.UNDERWEAR,
        outputAmount: 1,
    },
    {
        label: 'Vêtements de travail',
        inputs: [
            {
                id: Garment.TOP,
                amount: 1,
            },
            {
                id: Garment.PANT,
                amount: 1,
            },
        ],
        output: 'work_clothes',
        outputAmount: 1,
    },
];

const luxuryCraftZones: (ZoneOptions & { name: string })[] = [
    {
        name: 'ffs_luxury_craft1',
        center: [714.32, -972.22, 30.4],
        length: 0.8,
        width: 0.4,
        minZ: 30.2,
        maxZ: 30.65,
        heading: 0,
        debugPoly: false,
    },
    {
        name: 'ffs_luxury_craft2',
        center: [714.3, -969.96, 30.4],
        length: 0.7,
        width: 0.35,
        minZ: 30.2,
        maxZ: 30.6,
        heading: 0,
        debugPoly: false,
    },
    {
        name: 'ffs_luxury_craft3',
        center: [714.3, -967.78, 30.4],
        length: 0.7,
        width: 0.3,
        minZ: 30.2,
        maxZ: 30.65,
        heading: 0,
        debugPoly: false,
    },
];

const luxuryCraftProcesses: CraftProcess[] = [
    {
        label: 'Haut luxueux en fibre naturelle',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 80,
            },
        ],
        output: LuxuryGarment.TOP,
        outputAmount: 1,
    },
    {
        label: 'Haut luxueux en fibre artificielle',
        inputs: [
            {
                id: FabricMaterial.ARTIFICIAL_FIBER,
                amount: 40,
            },
        ],
        output: LuxuryGarment.TOP,
        outputAmount: 1,
    },
    {
        label: 'Pantalon luxueux synthétique',
        inputs: [
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 40,
            },
        ],
        output: LuxuryGarment.PANT,
        outputAmount: 1,
    },
    {
        label: 'Pantalon luxueux naturel',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 80,
            },
        ],
        output: LuxuryGarment.PANT,
        outputAmount: 1,
    },
    {
        label: 'Sous-vêtement luxueux',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 40,
            },
        ],
        output: LuxuryGarment.UNDERWEAR,
        outputAmount: 1,
    },
];

const shoesCraftZones: (ZoneOptions & { name: string })[] = [
    {
        name: 'ffs_shoes_craft1',
        center: [710.62, -969.53, 30.4],
        length: 2.4,
        width: 1.0,
        minZ: 30.05,
        maxZ: 30.4,
        heading: 0,
        debugPoly: false,
    },
];

const shoesCraftProcesses: CraftProcess[] = [
    {
        label: 'Paire de chaussures',
        inputs: [
            {
                id: FabricMaterial.LEATHER,
                amount: 3,
            },
            {
                id: FabricMaterial.LATEX,
                amount: 2,
            },
        ],
        output: Garment.SHOES,
        outputAmount: 1,
    },
    {
        label: 'Paire de chaussures luxueuses',
        inputs: [
            {
                id: FabricMaterial.LEATHER,
                amount: 6,
            },
            {
                id: FabricMaterial.LATEX,
                amount: 4,
            },
        ],
        output: LuxuryGarment.SHOES,
        outputAmount: 1,
    },
];

const getRewardFromDeliveredGarment = (garment: Garment | LuxuryGarment): number => {
    switch (garment) {
        case Garment.TOP:
        case Garment.PANT:
            return 24;
        case Garment.UNDERWEAR:
            return 10;
        case Garment.SHOES:
            return 15;
        case LuxuryGarment.TOP:
        case LuxuryGarment.PANT:
            return 48;
        case LuxuryGarment.UNDERWEAR:
            return 20;
        case LuxuryGarment.SHOES:
            return 30;
    }
};

export const FfsConfig = {
    transform: {
        processes: transformProcesses,
    },
    craft: {
        duration: 8000,
        zones: {
            craftZones,
            luxuryCraftZones,
            shoesCraftZones,
        },
        processes: {
            craftProcesses,
            luxuryCraftProcesses,
            shoesCraftProcesses,
        },
    },
    restock: {
        getRewardFromDeliveredGarment,
    },
};

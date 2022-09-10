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

export const TransformProcesses: {
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
        outputAmount: 10,
    },
    [FabricMaterial.ARTIFICIAL_FIBER]: {
        input: SewingRawMaterial.WOOD_PLANK,
        inputAmount: 1,
        output: FabricMaterial.ARTIFICIAL_FIBER,
        outputAmount: 10,
    },
    [FabricMaterial.LEATHER]: {
        input: SewingRawMaterial.SKIN,
        inputAmount: 1,
        output: FabricMaterial.LEATHER,
        outputAmount: 1,
    },
    [FabricMaterial.LATEX]: {
        input: SewingRawMaterial.SAP,
        inputAmount: 2,
        output: FabricMaterial.LATEX,
        outputAmount: 1,
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
        fabric: FabricMaterial;
        amount: number;
    }[];
    output: Garment | LuxuryGarment;
    outputAmount: number;
};

export const craftZones: (ZoneOptions & { name: string })[] = [
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

export const craftProcesses: CraftProcess[] = [
    {
        label: 'Haut en fibre naturelle',
        inputs: [
            {
                fabric: FabricMaterial.NATURAL_FIBER,
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
                fabric: FabricMaterial.ARTIFICIAL_FIBER,
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
                fabric: FabricMaterial.SYNTHETIC_FIBER,
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
                fabric: FabricMaterial.NATURAL_FIBER,
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
                fabric: FabricMaterial.NATURAL_FIBER,
                amount: 20,
            },
        ],
        output: Garment.UNDERWEAR,
        outputAmount: 1,
    },
];

export const luxuryCraftZones: (ZoneOptions & { name: string })[] = [
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

export const luxuryCraftProcesses: CraftProcess[] = [
    {
        label: 'Haut luxueux en fibre naturelle',
        inputs: [
            {
                fabric: FabricMaterial.NATURAL_FIBER,
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
                fabric: FabricMaterial.ARTIFICIAL_FIBER,
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
                fabric: FabricMaterial.SYNTHETIC_FIBER,
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
                fabric: FabricMaterial.NATURAL_FIBER,
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
                fabric: FabricMaterial.NATURAL_FIBER,
                amount: 40,
            },
        ],
        output: LuxuryGarment.UNDERWEAR,
        outputAmount: 1,
    },
];

export const shoesCraftZones: (ZoneOptions & { name: string })[] = [
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

export const shoesCraftProcesses: CraftProcess[] = [
    {
        label: 'Paire de chaussures',
        inputs: [
            {
                fabric: FabricMaterial.LEATHER,
                amount: 3,
            },
            {
                fabric: FabricMaterial.LATEX,
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
                fabric: FabricMaterial.LEATHER,
                amount: 6,
            },
            {
                fabric: FabricMaterial.LATEX,
                amount: 4,
            },
        ],
        output: LuxuryGarment.SHOES,
        outputAmount: 1,
    },
];

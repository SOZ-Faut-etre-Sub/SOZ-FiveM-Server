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

export const craftProcesses: CraftProcess[] = [
    {
        label: 'Fabrication: Chaussure',
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
        label: 'Fabrication: Haut en fibre naturelle',
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
        label: 'Fabrication: Haut en fibre artificielle',
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
        label: 'Fabrication: Pantalon synthétique',
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
        label: 'Fabrication: Pantalon naturel',
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
        label: 'Fabrication: Sous-vêtement',
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

export const luxuryCraftProcesses: CraftProcess[] = [
    {
        label: 'Fabrication: Chaussure luxueuse',
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
    {
        label: 'Fabrication: Haut luxueux en fibre naturelle',
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
        label: 'Fabrication: Haut luxueux en fibre artificielle',
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
        label: 'Fabrication: Pantalon luxueux synthétique',
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
        label: 'Fabrication: Pantalon luxueux naturel',
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
        label: 'Fabrication: Sous-vêtement luxueux',
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

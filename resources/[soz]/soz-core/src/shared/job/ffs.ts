enum SewingRawMaterial {
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

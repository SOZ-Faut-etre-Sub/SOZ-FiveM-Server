import { WardrobeConfig } from '../cloth';
import { NamedZone } from '../polyzone/box.zone';

export type FfsRecipe = {
    canCraft: boolean;
    label: string;
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

const transformProcesses: {
    [key in FabricMaterial]: Process;
} = {
    [FabricMaterial.NATURAL_FIBER]: {
        label: '🧶 Fibre naturelle',
        inputs: [
            {
                id: SewingRawMaterial.COTTON_BALE,
                amount: 1,
            },
        ],
        output: {
            id: FabricMaterial.NATURAL_FIBER,
            amount: 120,
        },
    },
    [FabricMaterial.SYNTHETIC_FIBER]: {
        label: '🧶 Fibre synthétique',
        inputs: [
            {
                id: SewingRawMaterial.REFINED_PETROLEUM,
                amount: 1,
            },
        ],
        output: {
            id: FabricMaterial.SYNTHETIC_FIBER,
            amount: 20,
        },
    },
    [FabricMaterial.ARTIFICIAL_FIBER]: {
        label: '🧶 Fibre artificielle',
        inputs: [
            {
                id: SewingRawMaterial.WOOD_PLANK,
                amount: 1,
            },
        ],
        output: {
            id: FabricMaterial.ARTIFICIAL_FIBER,
            amount: 20,
        },
    },
    [FabricMaterial.LEATHER]: {
        label: '🧶 Cuir',
        inputs: [
            {
                id: SewingRawMaterial.SKIN,
                amount: 1,
            },
        ],
        output: {
            id: FabricMaterial.LEATHER,
            amount: 8,
        },
    },
    [FabricMaterial.LATEX]: {
        label: '🧶 Latex',
        inputs: [
            {
                id: SewingRawMaterial.SAP,
                amount: 5,
            },
        ],
        output: {
            id: FabricMaterial.LATEX,
            amount: 2,
        },
    },
};

export enum Garment {
    TOP = 'garment_top',
    PANT = 'garment_pant',
    SHOES = 'garment_shoes',
    UNDERWEAR = 'garment_underwear',
    BAG = 'garment_bag',
    GLOVES = 'garment_gloves',
    UNDERWEAR_TOP = 'garment_underwear_top',
    MASK = 'garment_mask',
}

export enum LuxuryGarment {
    TOP = 'luxury_garment_top',
    PANT = 'luxury_garment_pant',
    SHOES = 'luxury_garment_shoes',
    UNDERWEAR = 'luxury_garment_underwear',
    BAG = 'luxury_garment_bag',
    GLOVES = 'luxury_garment_gloves',
    UNDERWEAR_TOP = 'luxury_garment_underwear_top',
}

export type Process = {
    label: string;
    inputs: {
        id: string;
        amount: number;
    }[];
    output: {
        id: string;
        amount: number;
    };
};

const craftZones: NamedZone[] = [
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

const craftProcesses: Process[] = [
    {
        label: '🧥 Haut en fibres naturelles',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 40,
            },
        ],
        output: {
            id: Garment.TOP,
            amount: 1,
        },
    },
    {
        label: '🧥 Haut en fibres artificielles',
        inputs: [
            {
                id: FabricMaterial.ARTIFICIAL_FIBER,
                amount: 20,
            },
        ],
        output: {
            id: Garment.TOP,
            amount: 1,
        },
    },
    {
        label: '👖 Pantalon synthétique',
        inputs: [
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 20,
            },
        ],
        output: {
            id: Garment.PANT,
            amount: 1,
        },
    },
    {
        label: '👖 Pantalon naturel',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 40,
            },
        ],
        output: {
            id: Garment.PANT,
            amount: 1,
        },
    },
    {
        label: '🩲 Sous-vêtement',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 20,
            },
        ],
        output: {
            id: Garment.UNDERWEAR,
            amount: 1,
        },
    },
    {
        label: '👕 Haut de sous-vêtement naturel',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 30,
            },
        ],
        output: {
            id: Garment.UNDERWEAR_TOP,
            amount: 1,
        },
    },
    {
        label: '👕 Haut de sous-vêtement synthétique',
        inputs: [
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 30,
            },
        ],
        output: {
            id: Garment.UNDERWEAR_TOP,
            amount: 1,
        },
    },
    {
        label: '⚒️ Vêtements de travail',
        inputs: [
            {
                id: Garment.TOP,
                amount: 4,
            },
            {
                id: Garment.PANT,
                amount: 4,
            },
        ],
        output: {
            id: 'work_clothes',
            amount: 4,
        },
    },
];

const luxuryCraftZones: NamedZone[] = [
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

const luxuryCraftProcesses: Process[] = [
    {
        label: '🧥 Haut luxueux en fibres naturelles',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 80,
            },
        ],
        output: {
            id: LuxuryGarment.TOP,
            amount: 1,
        },
    },
    {
        label: '🧥 Haut luxueux en fibres artificielles',
        inputs: [
            {
                id: FabricMaterial.ARTIFICIAL_FIBER,
                amount: 40,
            },
        ],
        output: {
            id: LuxuryGarment.TOP,
            amount: 1,
        },
    },
    {
        label: '👖 Pantalon luxueux synthétique',
        inputs: [
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 40,
            },
        ],
        output: {
            id: LuxuryGarment.PANT,
            amount: 1,
        },
    },
    {
        label: '👖 Pantalon luxueux naturel',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 80,
            },
        ],
        output: {
            id: LuxuryGarment.PANT,
            amount: 1,
        },
    },
    {
        label: '🩲 Sous-vêtement luxueux',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 40,
            },
        ],
        output: {
            id: LuxuryGarment.UNDERWEAR,
            amount: 1,
        },
    },
    {
        label: '👕 Haut de sous-vêtement luxueux naturel',
        inputs: [
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 60,
            },
        ],
        output: {
            id: LuxuryGarment.UNDERWEAR_TOP,
            amount: 1,
        },
    },
    {
        label: '👕 Haut de sous-vêtement luxueux synthétique',
        inputs: [
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 60,
            },
        ],
        output: {
            id: LuxuryGarment.UNDERWEAR_TOP,
            amount: 1,
        },
    },
];

const shoesCraftZones: NamedZone[] = [
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

const shoesCraftProcesses: Process[] = [
    {
        label: '👞 Paire de chaussures',
        inputs: [
            {
                id: FabricMaterial.LEATHER,
                amount: 1,
            },
            {
                id: FabricMaterial.LATEX,
                amount: 2,
            },
        ],
        output: {
            id: Garment.SHOES,
            amount: 1,
        },
    },
    {
        label: '👞 Paire de chaussures luxueuses',
        inputs: [
            {
                id: FabricMaterial.LEATHER,
                amount: 2,
            },
            {
                id: FabricMaterial.LATEX,
                amount: 4,
            },
        ],
        output: {
            id: LuxuryGarment.SHOES,
            amount: 1,
        },
    },
    {
        label: '🧤 Paire de gants',
        inputs: [
            {
                id: FabricMaterial.LEATHER,
                amount: 1,
            },
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 10,
            },
        ],
        output: {
            id: Garment.GLOVES,
            amount: 1,
        },
    },
    {
        label: '🧤 Paire de gants luxueux',
        inputs: [
            {
                id: FabricMaterial.LEATHER,
                amount: 2,
            },
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 20,
            },
        ],
        output: {
            id: LuxuryGarment.GLOVES,
            amount: 1,
        },
    },
    {
        label: '👜 Sac',
        inputs: [
            {
                id: FabricMaterial.LEATHER,
                amount: 1,
            },
            {
                id: FabricMaterial.LATEX,
                amount: 2,
            },
            {
                id: FabricMaterial.ARTIFICIAL_FIBER,
                amount: 10,
            },
        ],
        output: {
            id: Garment.BAG,
            amount: 1,
        },
    },
    {
        label: '👜 Sac luxueux',
        inputs: [
            {
                id: FabricMaterial.LEATHER,
                amount: 2,
            },
            {
                id: FabricMaterial.LATEX,
                amount: 4,
            },
            {
                id: FabricMaterial.ARTIFICIAL_FIBER,
                amount: 20,
            },
        ],
        output: {
            id: LuxuryGarment.BAG,
            amount: 1,
        },
    },
    {
        label: '🎭 Masque',
        inputs: [
            {
                id: FabricMaterial.LATEX,
                amount: 2,
            },
            {
                id: FabricMaterial.NATURAL_FIBER,
                amount: 10,
            },
            {
                id: FabricMaterial.SYNTHETIC_FIBER,
                amount: 10,
            },
        ],
        output: {
            id: Garment.MASK,
            amount: 1,
        },
    },
];

const getRewardFromDeliveredGarment = (garment: Garment | LuxuryGarment): number => {
    switch (garment) {
        case Garment.TOP:
        case Garment.PANT:
        case Garment.BAG:
        case Garment.MASK:
            return 50;
        case Garment.UNDERWEAR_TOP:
            return 30;
        case Garment.UNDERWEAR:
            return 20;
        case Garment.SHOES:
        case Garment.GLOVES:
            return 40;
        case LuxuryGarment.TOP:
        case LuxuryGarment.PANT:
        case LuxuryGarment.BAG:
            return 100;
        case LuxuryGarment.UNDERWEAR_TOP:
            return 60;
        case LuxuryGarment.UNDERWEAR:
            return 40;
        case LuxuryGarment.SHOES:
        case LuxuryGarment.GLOVES:
            return 80;
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
        duration: 2000,
        getRewardFromDeliveredGarment,
    },
};

export const FfsCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Tenue de Récolte']: {
            Components: {
                [3]: { Drawable: 185, Texture: 0, Palette: 0 },
                [4]: { Drawable: 59, Texture: 4, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 24, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 0, Texture: 2, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 118, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de Chasse']: {
            Components: {
                [3]: { Drawable: 185, Texture: 0, Palette: 0 },
                [4]: { Drawable: 97, Texture: 10, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 70, Texture: 10, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 0, Texture: 2, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 191, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de Vente']: {
            Components: {
                [3]: { Drawable: 27, Texture: 0, Palette: 0 },
                [4]: { Drawable: 24, Texture: 0, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 10, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 31, Texture: 2, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 32, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Ressources Humaines']: {
            Components: {
                [3]: { Drawable: 22, Texture: 0, Palette: 0 },
                [4]: { Drawable: 28, Texture: 12, Palette: 0 },
                [5]: { Drawable: 81, Texture: 0, Palette: 0 },
                [6]: { Drawable: 10, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 75, Texture: 3, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 29, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Direction']: {
            Components: {
                [3]: { Drawable: 27, Texture: 0, Palette: 0 },
                [4]: { Drawable: 24, Texture: 0, Palette: 0 },
                [5]: { Drawable: 81, Texture: 0, Palette: 0 },
                [6]: { Drawable: 10, Texture: 0, Palette: 0 },
                [7]: { Drawable: 24, Texture: 2, Palette: 0 },
                [8]: { Drawable: 4, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 35, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Tenue de Récolte']: {
            Components: {
                [3]: { Drawable: 20, Texture: 0, Palette: 0 },
                [4]: { Drawable: 61, Texture: 4, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 24, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 110, Texture: 4, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de Chasse']: {
            Components: {
                [3]: { Drawable: 21, Texture: 0, Palette: 0 },
                [4]: { Drawable: 100, Texture: 10, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 73, Texture: 10, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 259, Texture: 10, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de Vente']: {
            Components: {
                [3]: { Drawable: 23, Texture: 0, Palette: 0 },
                [4]: { Drawable: 133, Texture: 12, Palette: 0 },
                [5]: { Drawable: 82, Texture: 0, Palette: 0 },
                [6]: { Drawable: 0, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 77, Texture: 3, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 25, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ['Ressources Humaines']: {
            Components: {
                [3]: { Drawable: 27, Texture: 0, Palette: 0 },
                [4]: { Drawable: 133, Texture: 0, Palette: 0 },
                [5]: { Drawable: 81, Texture: 0, Palette: 0 },
                [6]: { Drawable: 20, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 13, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 25, Texture: 9, Palette: 0 },
            },
            Props: {},
        },
        ['Direction']: {
            Components: {
                [3]: { Drawable: 27, Texture: 0, Palette: 0 },
                [4]: { Drawable: 133, Texture: 0, Palette: 0 },
                [5]: { Drawable: 81, Texture: 0, Palette: 0 },
                [6]: { Drawable: 29, Texture: 0, Palette: 0 },
                [7]: { Drawable: 24, Texture: 2, Palette: 0 },
                [8]: { Drawable: 23, Texture: 11, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 7, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
    },
};
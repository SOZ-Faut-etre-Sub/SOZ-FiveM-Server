import { WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
import { NamedZone } from '../polyzone/box.zone';

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

export const FFSCraftsLists: Record<string, CraftCategory> = {
    Fibres: {
        animation: {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            options: {
                repeat: true,
                onlyUpperBody: true,
            },
        },
        duration: 2000,
        icon: '🧶',
        recipes: {
            [FabricMaterial.NATURAL_FIBER]: {
                amount: 120,
                inputs: {
                    [SewingRawMaterial.COTTON_BALE]: { count: 1 },
                },
            },
            [FabricMaterial.SYNTHETIC_FIBER]: {
                amount: 20,
                inputs: {
                    [SewingRawMaterial.REFINED_PETROLEUM]: { count: 1 },
                },
            },
            [FabricMaterial.ARTIFICIAL_FIBER]: {
                amount: 20,
                inputs: {
                    [SewingRawMaterial.WOOD_PLANK]: { count: 1 },
                },
            },
            [FabricMaterial.LEATHER]: {
                amount: 8,
                inputs: {
                    [SewingRawMaterial.SKIN]: { count: 1 },
                },
            },
            [FabricMaterial.LATEX]: {
                amount: 2,
                inputs: {
                    [SewingRawMaterial.SAP]: { count: 5 },
                },
            },
        },
    },
    ['Vêtements en fibres naturelles']: {
        animation: {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            options: {
                repeat: true,
                onlyUpperBody: true,
            },
        },
        duration: 8000,
        icon: '🧥',
        recipes: {
            [Garment.TOP]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.NATURAL_FIBER]: { count: 40 },
                },
            },
            [Garment.PANT]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.NATURAL_FIBER]: { count: 40 },
                },
            },
            [Garment.UNDERWEAR]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.NATURAL_FIBER]: { count: 20 },
                },
            },
            [Garment.UNDERWEAR_TOP]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.NATURAL_FIBER]: { count: 30 },
                },
            },
            [LuxuryGarment.TOP]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.NATURAL_FIBER]: { count: 80 },
                },
            },
            [LuxuryGarment.PANT]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.NATURAL_FIBER]: { count: 80 },
                },
            },
            [LuxuryGarment.UNDERWEAR]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.NATURAL_FIBER]: { count: 40 },
                },
            },
            [LuxuryGarment.UNDERWEAR_TOP]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.NATURAL_FIBER]: { count: 60 },
                },
            },
        },
    },
    ['Vêtements en fibres artificielles']: {
        animation: {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            options: {
                repeat: true,
                onlyUpperBody: true,
            },
        },
        duration: 8000,
        icon: '🧥',
        recipes: {
            [Garment.TOP]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 20 },
                },
            },
            [LuxuryGarment.TOP]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 40 },
                },
            },
        },
    },
    ['Vêtements en fibres synthétique']: {
        animation: {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            options: {
                repeat: true,
                onlyUpperBody: true,
            },
        },
        duration: 8000,
        icon: '👕',
        recipes: {
            [Garment.PANT]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 20 },
                },
            },
            [Garment.UNDERWEAR_TOP]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 30 },
                },
            },
            [LuxuryGarment.PANT]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 40 },
                },
            },
            [LuxuryGarment.UNDERWEAR_TOP]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 60 },
                },
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
        recipes: {
            work_clothes: {
                amount: 4,
                inputs: {
                    [Garment.TOP]: { count: 4 },
                    [Garment.PANT]: { count: 4 },
                },
            },
        },
    },
    ['Accessoires']: {
        animation: {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            options: {
                repeat: true,
                onlyUpperBody: true,
            },
        },
        duration: 8000,
        icon: '👞',
        recipes: {
            [Garment.SHOES]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LEATHER]: { count: 1 },
                    [FabricMaterial.LATEX]: { count: 2 },
                },
            },
            [LuxuryGarment.SHOES]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LEATHER]: { count: 2 },
                    [FabricMaterial.LATEX]: { count: 4 },
                },
            },
            [Garment.GLOVES]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LEATHER]: { count: 1 },
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 10 },
                },
            },
            [LuxuryGarment.GLOVES]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LEATHER]: { count: 2 },
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 20 },
                },
            },
            [Garment.BAG]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LEATHER]: { count: 1 },
                    [FabricMaterial.LATEX]: { count: 2 },
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 10 },
                },
            },
            [LuxuryGarment.BAG]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LEATHER]: { count: 2 },
                    [FabricMaterial.LATEX]: { count: 4 },
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 20 },
                },
            },
            [Garment.MASK]: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LATEX]: { count: 2 },
                    [FabricMaterial.NATURAL_FIBER]: { count: 10 },
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 10 },
                },
            },
        },
    },
};

export const FFSCraftZones: NamedZone[] = [
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
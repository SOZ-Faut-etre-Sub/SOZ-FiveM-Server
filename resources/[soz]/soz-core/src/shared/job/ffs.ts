import { WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
import { Feature } from '../features';
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
        event: 'job_ffs_transform',
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
        event: 'job_ffs_craft',
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
        event: 'job_ffs_craft',
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
        event: 'job_ffs_craft',
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
        event: 'job_ffs_craft',
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
        event: 'job_ffs_craft',
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
    Halloween: {
        animation: {
            name: 'base',
            dictionary: 'amb@prop_human_seat_sewing@female@base',
            options: {
                repeat: true,
                onlyUpperBody: true,
            },
        },
        duration: 8000,
        event: 'job_ffs_craft',
        feature: Feature.Halloween,
        icon: '🎃',
        recipes: {
            halloween_zombie_costume: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LATEX]: { count: 2 },
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 10 },
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 10 },
                },
            },
            halloween_alien_costume: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LATEX]: { count: 2 },
                    [FabricMaterial.NATURAL_FIBER]: { count: 10 },
                    [FabricMaterial.LEATHER]: { count: 10 },
                },
            },
            halloween_gorilla_costume: {
                amount: 1,
                inputs: {
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 2 },
                    [FabricMaterial.NATURAL_FIBER]: { count: 10 },
                    [FabricMaterial.LEATHER]: { count: 10 },
                },
            },
            halloween_galactic_ranger_costume: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LATEX]: { count: 2 },
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 10 },
                    [FabricMaterial.LEATHER]: { count: 10 },
                },
            },
            halloween_space_monkey_costume: {
                amount: 1,
                inputs: {
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 2 },
                    [FabricMaterial.NATURAL_FIBER]: { count: 10 },
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 10 },
                },
            },
            halloween_astronaut_costume: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LATEX]: { count: 2 },
                    [FabricMaterial.NATURAL_FIBER]: { count: 10 },
                    [FabricMaterial.LEATHER]: { count: 10 },
                },
            },
            halloween_fury_costume: {
                amount: 1,
                inputs: {
                    [FabricMaterial.ARTIFICIAL_FIBER]: { count: 2 },
                    [FabricMaterial.NATURAL_FIBER]: { count: 10 },
                    [FabricMaterial.SYNTHETIC_FIBER]: { count: 10 },
                },
            },
            halloween_juggernaut_costume: {
                amount: 1,
                inputs: {
                    [FabricMaterial.LATEX]: { count: 2 },
                    [FabricMaterial.NATURAL_FIBER]: { count: 10 },
                    [FabricMaterial.LEATHER]: { count: 10 },
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
            return 100;
        case Garment.UNDERWEAR_TOP:
            return 60;
        case Garment.UNDERWEAR:
            return 40;
        case Garment.SHOES:
        case Garment.GLOVES:
            return 80;
        case LuxuryGarment.TOP:
        case LuxuryGarment.PANT:
        case LuxuryGarment.BAG:
            return 200;
        case LuxuryGarment.UNDERWEAR_TOP:
            return 120;
        case LuxuryGarment.UNDERWEAR:
            return 80;
        case LuxuryGarment.SHOES:
        case LuxuryGarment.GLOVES:
            return 160;
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
        ['Tenue Employé']: {
            Components: {
                [3]: { Drawable: 4, Texture: 0, Palette: 0 },
                [4]: { Drawable: 53, Texture: 0, Palette: 0 },
                [5]: { Drawable: 41, Texture: 0, Palette: 0 },
                [6]: { Drawable: 20, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 31, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 103, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de Chasse']: {
            Components: {
                [3]: { Drawable: 19, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 0, Palette: 0 },
                [5]: { Drawable: 86, Texture: 21, Palette: 0 },
                [6]: { Drawable: 71, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 105, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 247, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Tenue Employée']: {
            Components: {
                [3]: { Drawable: 3, Texture: 0, Palette: 0 },
                [4]: { Drawable: 55, Texture: 0, Palette: 0 },
                [5]: { Drawable: 41, Texture: 0, Palette: 0 },
                [6]: { Drawable: 29, Texture: 2, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 38, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 94, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue Employée - Talon']: {
            Components: {
                [3]: { Drawable: 3, Texture: 0, Palette: 0 },
                [4]: { Drawable: 55, Texture: 0, Palette: 0 },
                [5]: { Drawable: 41, Texture: 0, Palette: 0 },
                [6]: { Drawable: 6, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 38, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 94, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de Chasse']: {
            Components: {
                [3]: { Drawable: 20, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 0, Palette: 0 },
                [5]: { Drawable: 86, Texture: 21, Palette: 0 },
                [6]: { Drawable: 74, Texture: 0, Palette: 0 },
                [7]: { Drawable: 0, Texture: 0, Palette: 0 },
                [8]: { Drawable: 142, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 255, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
    },
};

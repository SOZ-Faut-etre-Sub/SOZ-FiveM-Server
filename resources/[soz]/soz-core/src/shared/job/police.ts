import { Component, Prop, WardrobeConfig } from '../cloth';
import { VanillaComponentDrawableIndexMaxValue, VanillaPropDrawableIndexMaxValue } from '../drawable';
import { joaat } from '../joaat';
import { JobType } from '../job';
import { PlayerLicenceType } from '../player';
import { Vector4 } from '../polyzone/vector';

export const DUTY_OUTFIT_NAME = 'Tenue de service';
export const WINTER = 'Tenue Hiver';
export const SASP_DARK = 'Tenue sombre';
export const MOTO = 'Tenue de moto';

export const PrisonerClothes = {
    [joaat('mp_m_freemode_01')]: {
        Components: {
            [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Legs]: { Drawable: 3, Texture: 7, Palette: 0 },
            [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Shoes]: { Drawable: 12, Texture: 12, Palette: 0 },
            [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
            [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Tops]: { Drawable: 146, Texture: 0, Palette: 0 },
        },
        Props: {
            [Prop.Hat]: { Clear: true },
            [Prop.Glasses]: { Clear: true },
            [Prop.Ear]: { Clear: true },
            [Prop.LeftHand]: { Clear: true },
            [Prop.RightHand]: { Clear: true },
            [Prop.Helmet]: { Clear: true },
        },
        GlovesID: 0,
    },
    [joaat('mp_f_freemode_01')]: {
        Components: {
            [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Torso]: { Drawable: 2, Texture: 0, Palette: 0 },
            [Component.Legs]: { Drawable: 3, Texture: 15, Palette: 0 },
            [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Shoes]: { Drawable: 66, Texture: 5, Palette: 0 },
            [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
            [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
            [Component.Tops]: { Drawable: 38, Texture: 3, Palette: 0 },
        },
        Props: {
            [Prop.Hat]: { Clear: true },
            [Prop.Glasses]: { Clear: true },
            [Prop.Ear]: { Clear: true },
            [Prop.LeftHand]: { Clear: true },
            [Prop.RightHand]: { Clear: true },
            [Prop.Helmet]: { Clear: true },
        },
        GlovesID: 0,
    },
};

export const POLICE_CLOAKROOM: Partial<Record<JobType, WardrobeConfig>> = {
    [JobType.LSPD]: {
        [joaat('mp_m_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Bag],
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat],
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            [WINTER]: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 8,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat],
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            /*["Tenue SWAT"]:  {
                Components:  {
                [Component.Mask]:  {Drawable:  185, Texture:  0, Palette:  0},
                [Component.Torso]:  {Drawable:  179, Texture:  0, Palette:  0},
                [Component.Legs]:  {Drawable:  31, Texture:  0, Palette:  0},
                [Component.Bag]:  {Drawable:  48, Texture:  0, Palette:  0},
                [Component.Shoes]:  {Drawable:  25, Texture:  0, Palette:  0},
                [Component.Accessories]:  {Drawable:  110, Texture:  0, Palette:  0},
                [Component.Undershirt]:  {Drawable:  15, Texture:  0, Palette:  0},
                [Component.BodyArmor]:  {Drawable:  16, Texture:  0, Palette:  0},
                [Component.Decals]:  {Drawable:  0, Texture:  0, Palette:  0},
                [Component.Tops]:  {Drawable:  220, Texture:  0, Palette:  0},
                },
                Props:  {
                    [Prop.Helmet]:  {Drawable:  150, Texture:  0, Palette:  0},
                    [Prop.Glasses]:  {Drawable:  21, Texture:  0, Palette:  0},
                },
            },*/
            ['Tenue de pilote']: {
                Components: {
                    [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 5,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            [MOTO]: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Bag],
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                GlovesID: 56000,
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Decals] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {},
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 10,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 12,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {},
            },
        },
        [joaat('mp_f_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Bag],
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat],
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            [WINTER]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 8,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat],
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            /* ["Tenue SWAT"]:  {
            Components:  {
                [Component.Mask]:  {Drawable:  185, Texture:  0, Palette:  0},
                [Component.Torso]:  {Drawable:  215, Texture:  0, Palette:  0},
                [Component.Legs]:  {Drawable:  30, Texture:  0, Palette:  0},
                [Component.Bag]:  {Drawable:  48, Texture:  0, Palette:  0},
                [Component.Shoes]:  {Drawable:  25, Texture:  0, Palette:  0},
                [Component.Accessories]:  {Drawable:  81, Texture:  0, Palette:  0},
                [Component.Undershirt]:  {Drawable:  15, Texture:  0, Palette:  0},
                [Component.BodyArmor]:  {Drawable:  18, Texture:  0, Palette:  0},
                [Component.Decals]:  {Drawable:  0, Texture:  0, Palette:  0},
                [Component.Tops]:  {Drawable:  230, Texture:  0, Palette:  0},
            },
            Props:  {
                [Prop.Helmet]:  {Drawable:  149, Texture:  0, Palette:  0},
                [Prop.Glasses]:  {Drawable:  22, Texture:  0, Palette:  0},
            },
        }, */
            ['Tenue de pilote']: {
                Components: {
                    [Component.Torso]: { Drawable: 17, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 5,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            [MOTO]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Bag],
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                GlovesID: 55000,
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Decals] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {},
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 10,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 12,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {},
            },
        },
    },
    [JobType.BCSO]: {
        [joaat('mp_m_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Bag] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            [WINTER]: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops],
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Tenue de pilote']: {
                Components: {
                    [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 5,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            [MOTO]: {
                Components: {
                    [Component.Torso]: { Drawable: 20, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 3,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Bag] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },

                    [Component.Decals]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Decals] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {},
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 10,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 12,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {},
            },
        },
        [joaat('mp_f_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Bag] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            [WINTER]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops],
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Tenue de pilote']: {
                Components: {
                    [Component.Torso]: { Drawable: 36, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 5,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            [MOTO]: {
                Components: {
                    [Component.Torso]: { Drawable: 23, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 3,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Bag] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Decals] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {},
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 10,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 12,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {},
            },
        },
    },
    [JobType.SASP]: {
        [joaat('mp_m_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 22, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 2,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Bag] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 8,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 2,
                        Texture: 2,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            [SASP_DARK]: {
                Components: {
                    [Component.Torso]: { Drawable: 22, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 8,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Bag] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 8,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 2,
                        Texture: 3,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 7,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
        },
        [joaat('mp_f_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 2,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Bag] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 10,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 2,
                        Texture: 2,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            [SASP_DARK]: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 8,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Bag] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 10,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 2,
                        Texture: 3,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 7,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
        },
    },
    [JobType.LSCS]: {
        [joaat('mp_m_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: 35,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: 0,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 60, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: {
                        Drawable: 58,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: 55,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: 46,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
        },
        [joaat('mp_f_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: 34,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: 0,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: {
                        Drawable: 35,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: 48,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: 45,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
        },
    },
};

export const RankOutfit: Partial<Record<JobType, Record<string, Record<number, [number, number]>>>> = {
    [JobType.LSPD]: {
        [DUTY_OUTFIT_NAME]: {
            [78]: [7, 0], // Officier
            [284]: [7, 1], // Caporal
            [77]: [7, 2], // Sergeant
            [76]: [2, 0], // Second Lieutenant
            [285]: [2, 1], // Premier Lieutenant
            [75]: [2, 2], // Captain
            [74]: [2, 3], // Commander
            [73]: [2, 4], // Deputy Chief
            [30]: [2, 5], // Chief of Police
        },
        [MOTO]: {
            [78]: [7, 0], // Officier
            [284]: [7, 1], // Caporal
            [77]: [7, 2], // Sergeant
            [76]: [9, 0], // Second Lieutenant
            [285]: [9, 1], // Premier Lieutenant
            [75]: [9, 2], // Captain
            [74]: [9, 3], // Commander
            [73]: [9, 4], // Deputy Chief
            [30]: [9, 5], // Chief of Police
        },
        [WINTER]: {
            [78]: [12, 0], // Officier
            [284]: [12, 1], // Caporal
            [77]: [12, 2], // Sergeant
            [76]: [10, 0], // Second Lieutenant
            [285]: [10, 1], // Premier Lieutenant
            [75]: [10, 2], // Captain
            [74]: [10, 3], // Commander
            [73]: [10, 4], // Deputy Chief
            [30]: [10, 5], // Chief of Police
        },
    },
    [JobType.BCSO]: {
        [DUTY_OUTFIT_NAME]: {
            [71]: [0, 0], // Junior
            [70]: [0, 1], // Senior
            [69]: [0, 2], // Major
            [282]: [5, 0], // Second Brigadier
            [68]: [5, 1], // Premier Brigadier
            [283]: [5, 2], // supervisor
            [201]: [5, 3], // Division chief
            [66]: [5, 4], // Undersheriff
            [38]: [5, 5], // Sheriff
        },
        [MOTO]: {
            [71]: [0, 0], // Junior
            [70]: [0, 1], // Senior
            [69]: [0, 2], // Major
            [282]: [8, 0], // Second Brigadier
            [68]: [8, 1], // Premier Brigadier
            [283]: [8, 2], // supervisor
            [201]: [8, 3], // Division chief
            [66]: [8, 4], // Undersheriff
            [38]: [8, 5], // Sheriff
        },
        [WINTER]: {
            [71]: [13, 0], // Junior
            [70]: [13, 1], // Senior
            [69]: [13, 2], // Major
            [282]: [11, 0], // Second Brigadier
            [68]: [11, 1], // Premier Brigadier
            [283]: [11, 2], // supervisor
            [201]: [11, 3], // Division chief
            [66]: [11, 4], // Undersheriff
            [38]: [11, 5], // Sheriff
        },
    },
    [JobType.SASP]: {
        [DUTY_OUTFIT_NAME]: {
            [235]: [6, 0], // Trooper
            [286]: [6, 1], // Corporal Trooper
            [234]: [6, 2], // Sergeant Trooper
            [233]: [6, 3], // Lieutenant Trooper
            [232]: [6, 4], // Assistant Commissioner
            [231]: [6, 5], // Commissioner
        },
        [SASP_DARK]: {
            [235]: [6, 0], // Trooper
            [286]: [6, 1], // Corporal Trooper
            [234]: [6, 2], // Sergeant Trooper
            [233]: [6, 3], // Lieutenant Trooper
            [232]: [6, 4], // Assistant Commissioner
            [231]: [6, 5], // Commissioner
        },
    },
};

export const Armors = {
    [joaat('mp_m_freemode_01')]: {
        ['unmark']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 2,
            Texture: 0,
            Palette: 0,
        },
        ['lspd']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 1,
            Texture: 0,
            Palette: 0,
        },
        ['bcso']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 2,
            Texture: 3,
            Palette: 0,
        },
        ['lsmc']: { Drawable: 27, Texture: 8, Palette: 0 }, // is unmarked, need reskin
        ['stonk']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor],
            Texture: 0,
            Palette: 0,
        },
        ['fbi']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 2,
            Texture: 2,
            Palette: 0,
        },
        ['news']: { Drawable: 27, Texture: 2, Palette: 0 }, // is unmarked, need reskin
        ['you-news']: { Drawable: 27, Texture: 4, Palette: 0 }, // is unmarked, need reskin
        ['sasp1']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 9,
            Texture: 0,
            Palette: 0,
        },
        ['sasp2']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 10,
            Texture: 0,
            Palette: 0,
        },
    },
    [joaat('mp_f_freemode_01')]: {
        ['unmark']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 2,
            Texture: 7,
            Palette: 0,
        },
        ['lspd']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 1,
            Texture: 0,
            Palette: 0,
        },
        ['bcso']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 2,
            Texture: 3,
            Palette: 0,
        },
        ['lsmc']: { Drawable: 31, Texture: 8, Palette: 0 }, // is unmarked, need reskin
        ['stonk']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor],
            Texture: 0,
            Palette: 0,
        },
        ['fbi']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 2,
            Texture: 2,
            Palette: 0,
        },
        ['news']: { Drawable: 31, Texture: 2, Palette: 0 }, // is unmarked, need reskin
        ['you-news']: { Drawable: 31, Texture: 4, Palette: 0 }, // is unmarked, need reskin
        ['sasp1']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 9,
            Texture: 0,
            Palette: 0,
        },
        ['sasp2']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 8,
            Texture: 0,
            Palette: 0,
        },
    },
};

export const ObjectOutFits: Partial<Record<JobType, WardrobeConfig>> = {
    [JobType.LSPD]: {
        [joaat('mp_m_freemode_01')]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.LSPD][joaat('mp_m_freemode_01')][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 96, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 10,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 150, Texture: 0, Palette: 0 },
                    [Prop.Glasses]: { Drawable: 40, Texture: 0, Palette: 0 },
                },
            },
            ['heavy_antiriot_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 96, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 7,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 5,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 11,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 125, Texture: 0, Palette: 0 },
                },
            },
        },
        [joaat('mp_f_freemode_01')]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.LSPD][joaat('mp_f_freemode_01')][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 111, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 10,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 149, Texture: 0, Palette: 0 },
                    [Prop.Glasses]: { Drawable: 42, Texture: 0, Palette: 0 },
                },
            },
            ['heavy_antiriot_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 111, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 7,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 5,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 11,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 124, Texture: 0, Palette: 0 },
                },
            },
        },
    },
    [JobType.BCSO]: {
        [joaat('mp_m_freemode_01')]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.BCSO][joaat('mp_m_freemode_01')][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 20, Palette: 0 },
                    [Component.Torso]: { Drawable: 96, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 6,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 10,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 150, Texture: 1, Palette: 0 },
                    [Prop.Glasses]: { Drawable: 40, Texture: 7, Palette: 0 },
                },
            },
            ['heavy_antiriot_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 52, Texture: 4, Palette: 0 },
                    [Component.Torso]: { Drawable: 96, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 7,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.BodyArmor] + 5,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 11,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 125, Texture: 0, Palette: 0 },
                },
            },
        },
        [joaat('mp_f_freemode_01')]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.BCSO][joaat('mp_f_freemode_01')][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 20, Palette: 0 },
                    [Component.Torso]: { Drawable: 111, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 6,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 10,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 149, Texture: 1, Palette: 0 },
                    [Prop.Glasses]: { Drawable: 42, Texture: 7, Palette: 0 },
                },
            },
            ['heavy_antiriot_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 52, Texture: 4, Palette: 0 },
                    [Component.Torso]: { Drawable: 111, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 7,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 5,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 11,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 124, Texture: 0, Palette: 0 },
                },
            },
        },
    },
};

export type PoliceJobLicencesMenuData = {
    job: JobType;
    playerServerId: number;
    playerLicences: Partial<Record<PlayerLicenceType, number>>;
};

export type PoliceClue = {
    id: string;
    model: number;
    position: Vector4;
    noCollision: boolean;
    invisible: boolean;
    matrix?: Float32Array;
    placeOnGround: boolean;
    type: 'evidence_bullet' | 'evidence_blood' | 'evidence_glass';
    information: string;
    outline: boolean;
    quantity: number;
};

export type PoliceJobMoneycheckerMenuData = {
    job: JobType;
    playerServerId: number;
    amount: number;
};

export type PoliceJobFineMenuData = {
    job: JobType;
    playerServerId: number;
};

export type PoliceJobMenuData = {
    job: JobType;
    onDuty: boolean;
    displayRadar: boolean;
};

export const LicencesWithPoints = {
    [PlayerLicenceType.Car]: true,
    [PlayerLicenceType.Truck]: true,
    [PlayerLicenceType.Moto]: true,
    [PlayerLicenceType.Heli]: true,
    [PlayerLicenceType.Boat]: true,
    [PlayerLicenceType.Weapon]: false,
    [PlayerLicenceType.Fishing]: false,
    [PlayerLicenceType.Hunting]: false,
    [PlayerLicenceType.Rescuer]: false,
};

export const PoliceCanEditLicences = {
    [PlayerLicenceType.Car]: true,
    [PlayerLicenceType.Truck]: true,
    [PlayerLicenceType.Moto]: true,
    [PlayerLicenceType.Heli]: true,
    [PlayerLicenceType.Boat]: true,
    [PlayerLicenceType.Weapon]: true,
    [PlayerLicenceType.Fishing]: true,
    [PlayerLicenceType.Hunting]: true,
    [PlayerLicenceType.Rescuer]: false,
};

export type Fine = {
    id: number;
    label: string;
    category: number;
    price: { min: number; max: number };
};

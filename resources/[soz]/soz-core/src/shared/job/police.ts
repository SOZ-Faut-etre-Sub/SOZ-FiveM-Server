import { Component, Prop, WardrobeConfig } from '../cloth';
import { VanillaComponentDrawableIndexMaxValue, VanillaPropDrawableIndexMaxValue } from '../drawable';
import { joaat } from '../joaat';
import { JobType } from '../job';
import { PlayerLicenceType } from '../player';

export const DUTY_OUTFIT_NAME = 'Tenue de service';

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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
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
            ['Tenue Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
            ['Tenue de moto']: {
                Components: {
                    [Component.Torso]: { Drawable: 22, Texture: 0, Palette: 0 },
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 130, Texture: 0, Palette: 0 },
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
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
            ['Tenue Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
            ['Tenue de moto']: {
                Components: {
                    [Component.Torso]: { Drawable: 23, Texture: 0, Palette: 0 },
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 160, Texture: 0, Palette: 0 },
                },
                Props: {},
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 11,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 14,
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
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
            ['Tenue Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
            ['Tenue de moto']: {
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
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 130, Texture: 0, Palette: 0 },
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
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
            ['Tenue Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
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
            ['Tenue de moto']: {
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
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
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
                            VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 160, Texture: 0, Palette: 0 },
                },
                Props: {},
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 11,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 14,
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
            ['Tenue sombre']: {
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
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
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
            ['Tenue sombre']: {
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
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
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
};

export const RankOutfit = {
    [JobType.LSPD]: {
        [78]: [0, 0], // Officier
        [77]: [0, 1], // Sergeant
        [76]: [2, 0], // Lieutenant
        [75]: [2, 1], // Captain
        [74]: [2, 2], // Commander
        [73]: [2, 3], // Deputy Chief
        [30]: [2, 4], // Chief of Police
    },
    [JobType.BCSO]: {
        [70]: [0, 2], // Senior
        [69]: [0, 3], // Major
        [68]: [2, 5], // Major Chief
        [201]: [2, 6], // Division Sheriff - previously 67 - Assistant Sheriff
        [66]: [2, 7], // Undersheriff
        [38]: [1, 0], // Sheriff
    },
    [JobType.SASP]: {},
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
        ['sasp1']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 8,
            Texture: 0,
            Palette: 0,
        },
        ['sasp2']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.BodyArmor] + 8,
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
    label: string;
    price: { min: number; max: number };
};

export const Fines = {
    '1': {
        label: 'Catégorie 1',
        items: [
            { label: 'Rappel à la loi', price: { min: 150, max: 450 } },
            { label: 'Infraction aux règles de circulation', price: { min: 200, max: 600 } },
            { label: 'Permis ou licence manquant', price: { min: 300, max: 900 } },
            { label: 'Participation à un événement illégal ', price: { min: 450, max: 1350 } },
            { label: 'Vol ou extorsion', price: { min: 500, max: 1500 } },
            { label: 'Dégradation de bien privé', price: { min: 500, max: 1500 } },
            { label: "Trouble à l'ordre publique", price: { min: 500, max: 1500 } },
            { label: 'Braconnage ou commerce illégal', price: { min: 600, max: 1800 } },
            { label: 'Insulte ou outrage', price: { min: 600, max: 1800 } },
        ],
    },
    '2': {
        label: 'Catégorie 2',
        items: [
            { label: "Détention d'objet prohibé", price: { min: 700, max: 2100 } },
            { label: "Refus d'obtempérer", price: { min: 800, max: 2400 } },
            { label: 'Violation de propriété privée', price: { min: 850, max: 2550 } },
            { label: 'Vente de stupéfiants', price: { min: 900, max: 2700 } },
            { label: 'Dégradation de bien public', price: { min: 1000, max: 3000 } },
            { label: "Port d'arme illégal", price: { min: 1000, max: 3000 } },
            { label: 'Braquage de commerce local', price: { min: 1500, max: 4500 } },
            { label: 'Trafic de stupéfiants', price: { min: 2500, max: 7500 } },
            { label: "Atteinte à l'intégrité morale et/ou physique", price: { min: 1200, max: 3600 } },
            { label: "Mise en danger d'autrui", price: { min: 1500, max: 4500 } },
        ],
    },
    '3': {
        label: 'Catégorie 3',
        items: [
            { label: 'Obstruction à la justice', price: { min: 1750, max: 5700 } },
            { label: "Divulgation d'info Confidentielle", price: { min: 2000, max: 6000 } },
            { label: "Usurpation d'identité / Impersonation", price: { min: 2000, max: 6000 } },
            { label: 'Détention de matériel militaire prohibé', price: { min: 2500, max: 7500 } },
            { label: "Atteinte à l'intégrité morale et/ou physique armée", price: { min: 3500, max: 10500 } },
            { label: "Tentative d'enlèvement", price: { min: 3500, max: 10500 } },
        ],
    },
    '4': {
        label: 'Catégorie 4',
        items: [
            { label: 'Corruption', price: { min: 5000, max: 15000 } },
            { label: "Enlèvement ou prise d'otage", price: { min: 6000, max: 18000 } },
            { label: 'Violation de serment', price: { min: 8000, max: 24000 } },
            { label: 'Homicide', price: { min: 10000, max: 30000 } },
            { label: 'Perturbation de San Andreas', price: { min: 10000, max: 30000 } },
        ],
    },
};

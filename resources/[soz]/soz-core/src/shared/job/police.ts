import { Component, Prop, WardrobeConfig } from '../cloth';
import { VanillaComponentDrawableIndexMaxValue, VanillaPropDrawableIndexMaxValue } from '../drawable';
import { JobType } from '../job';

export const DUTY_OUTFIT_NAME = 'Tenue de service';

export const PrisonerClothes = {
    [GetHashKey('mp_m_freemode_01')]: {
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
    },
    [GetHashKey('mp_f_freemode_01')]: {
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
    },
};

export const POLICE_CLOAKROOM: Partial<Record<JobType, WardrobeConfig>> = {
    [JobType.LSPD]: {
        [GetHashKey('mp_m_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Bag],
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {},
            },
            ['Tenue Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 12, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 8,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {},
            },
            /*[[ ["Tenue SWAT"]:  {
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
        }, */
            ['Tenue de pilote']: {
                Components: {
                    [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 5,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Tenue de moto']: {
                Components: {
                    [Component.Torso]: { Drawable: 22, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Bag],
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Accessories
                            ] + 2,
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
                    [Component.Legs]: { Drawable: 168, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 454, Texture: 1, Palette: 0 },
                },
                Props: {},
            },
        },
        [GetHashKey('mp_f_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Bag],
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {},
            },
            ['Tenue Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 8,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {},
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
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 5,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Tenue de moto']: {
                Components: {
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Bag],
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Accessories
                            ] + 2,
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
                    [Component.Legs]: { Drawable: 179, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 487, Texture: 1, Palette: 0 },
                },
                Props: {},
            },
        },
    },
    [JobType.BCSO]: {
        [GetHashKey('mp_m_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Bag] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Tenue Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops],
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Tenue de pilote']: {
                Components: {
                    [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 5,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            ['Tenue de moto']: {
                Components: {
                    [Component.Torso]: { Drawable: 20, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 3,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Bag] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Accessories
                            ] + 2,
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
                    [Component.Legs]: { Drawable: 168, Texture: 1, Palette: 0 },
                    [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 454, Texture: 0, Palette: 0 },
                },
                Props: {},
            },
        },
        [GetHashKey('mp_f_freemode_01')]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Bag] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Tenue Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops],
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat] + 2,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
            ['Tenue de pilote']: {
                Components: {
                    [Component.Torso]: { Drawable: 36, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 5,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat] + 4,
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            ['Tenue de moto']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 3,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Bag] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 2,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: {
                        Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat] + 1,
                        Texture: 1,
                        Palette: 0,
                    },
                },
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Accessories
                            ] + 2,
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
                    [Component.Legs]: { Drawable: 179, Texture: 1, Palette: 0 },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 487, Texture: 0, Palette: 0 },
                },
                Props: {},
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
        [67]: [2, 6], // Assistant Sheriff
        [66]: [2, 7], // Undersheriff
        [38]: [1, 0], // Sheriff
    },
};

export const Armors = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['unmark']: { Drawable: 27, Texture: 0, Palette: 0 },
        ['lspd']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] + 1,
            Texture: 0,
            Palette: 0,
        },
        ['bcso']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] + 2,
            Texture: 3,
            Palette: 0,
        },
        ['lsmc']: { Drawable: 27, Texture: 0, Palette: 0 }, // is unmarked, need reskin
        ['stonk']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor],
            Texture: 0,
            Palette: 0,
        },
        ['fbi']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] + 2,
            Texture: 2,
            Palette: 0,
        },
        ['news']: { Drawable: 27, Texture: 0, Palette: 0 }, // is unmarked, need reskin
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['unmark']: { Drawable: 31, Texture: 7, Palette: 0 },
        ['lspd']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.BodyArmor] + 1,
            Texture: 0,
            Palette: 0,
        },
        ['bcso']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.BodyArmor] + 2,
            Texture: 3,
            Palette: 0,
        },
        ['lsmc']: { Drawable: 31, Texture: 7, Palette: 0 }, // is unmarked, need reskin
        ['stonk']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.BodyArmor],
            Texture: 0,
            Palette: 0,
        },
        ['fbi']: {
            Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.BodyArmor] + 2,
            Texture: 2,
            Palette: 0,
        },
        ['news']: { Drawable: 31, Texture: 7, Palette: 0 }, // is unmarked, need reskin
    },
};

export const ObjectOutFits: Partial<Record<JobType, WardrobeConfig>> = {
    [JobType.LSPD]: {
        [GetHashKey('mp_m_freemode_01')]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.LSPD][GetHashKey('mp_m_freemode_01')][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 96, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Accessories
                            ] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] +
                            3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 10,
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
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 7,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] +
                            5,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 11,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 125, Texture: 0, Palette: 0 },
                },
            },
        },
        [GetHashKey('mp_f_freemode_01')]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.LSPD][GetHashKey('mp_f_freemode_01')][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 111, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 6,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Accessories
                            ] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.BodyArmor] +
                            3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 10,
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
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 7,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.BodyArmor] +
                            5,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 11,
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
        [GetHashKey('mp_m_freemode_01')]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.BCSO][GetHashKey('mp_m_freemode_01')][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 20, Palette: 0 },
                    [Component.Torso]: { Drawable: 96, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 6,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Accessories
                            ] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] +
                            4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 10,
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
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 7,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][
                                Component.Undershirt
                            ] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.BodyArmor] +
                            5,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 11,
                        Texture: 1,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 125, Texture: 0, Palette: 0 },
                },
            },
        },
        [GetHashKey('mp_f_freemode_01')]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.BCSO][GetHashKey('mp_f_freemode_01')][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 20, Palette: 0 },
                    [Component.Torso]: { Drawable: 111, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 6,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Accessories
                            ] + 1,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.BodyArmor] +
                            4,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 10,
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
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 7,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][
                                Component.Undershirt
                            ] + 3,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.BodyArmor]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.BodyArmor] +
                            5,
                        Texture: 1,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable:
                            VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 11,
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

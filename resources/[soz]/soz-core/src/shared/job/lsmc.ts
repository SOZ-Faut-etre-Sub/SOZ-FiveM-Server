import { Component, Prop, WardrobeConfig } from '../cloth';
import { VanillaComponentDrawableIndexMaxValue, VanillaPropDrawableIndexMaxValue } from '../drawable';
import { joaat } from '../joaat';
import { Vector3, Vector4 } from '../polyzone/vector';

export type KillerVehData = {
    name: string;
    seat: number;
    plate: string;
};

export type KillData = {
    killerid: number;
    killertype: number;
    killerentitytype: number;
    weaponhash: number;
    weapondamagetype: number;
    killpos: Vector3;
    killerveh?: KillerVehData;
    ejection: boolean;
};

export const PHARMACY_PRICES = {
    tissue: 250,
    antibiotic: 250,
    pommade: 250,
    painkiller: 250,
    antiacide: 250,
    heal: 400,
    health_book: 400,
};

export const BedLocations: Vector3[] = [
    [312.84, -1433.25, 32.07],
    [315.47, -1435.46, 32.07],
    [318.02, -1437.59, 32.07],
    [323.21, -1441.95, 32.07],
    [325.71, -1444.05, 32.07],
    [328.38, -1446.29, 32.07],
];
export const FailoverLocation: Vector4 = [337.57, -1435.95, 32.51, 83.48];

export const PatientClothes: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ['Patient']: {
            Components: {
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Torso]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 61, Texture: 0, Palette: 0 },
                [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 7,
                    Texture: 0,
                    Palette: 0,
                },
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
    },
    [joaat('mp_f_freemode_01')]: {
        ['Patient']: {
            Components: {
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 15, Texture: 3, Palette: 0 },
                [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 35, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 7,
                    Texture: 0,
                    Palette: 0,
                },
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
    },
};

export const DUTY_OUTFIT_NAME = 'Tenue de service';
export const HAZMAT_OUTFIT_NAME = 'Tenue hazmat';

export const LsmcCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        [DUTY_OUTFIT_NAME]: {
            Components: {
                [Component.Torso]: { Drawable: 92, Texture: 0, Palette: 0 },
                [Component.Legs]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 4,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                [Component.Accessories]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories],
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Undershirt]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Undershirt] + 5,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 3,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {},
        },
        ['Tenue incendie']: {
            Components: {
                [Component.Torso]: { Drawable: 96, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 120, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 151, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 16, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 314, Texture: 0, Palette: 0 },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Prop.Hat] + 3,
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
        [HAZMAT_OUTFIT_NAME]: {
            Components: {
                [Component.Mask]: { Drawable: 46, Texture: 0, Palette: 0 },
                [Component.Torso]: { Drawable: 86, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 40, Texture: 0, Palette: 0 },
                [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 62, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 67, Texture: 0, Palette: 0 },
            },
            Props: { [Prop.Hat]: { Clear: true } },
        },
        ['Tenue Hiver']: {
            Components: {
                [Component.Torso]: { Drawable: 90, Texture: 0, Palette: 0 },
                [Component.Legs]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Legs] + 4,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                [Component.Accessories]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Accessories],
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Undershirt]: { Drawable: 179, Texture: 11, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_m_freemode_01')][Component.Tops] + 6,
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
                [Component.Torso]: { Drawable: 106, Texture: 0, Palette: 0 },
                [Component.Legs]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 4,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                [Component.Accessories]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories],
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Undershirt]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Undershirt] + 5,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 3,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {},
        },
        ['Tenue incendie']: {
            Components: {
                [Component.Torso]: { Drawable: 111, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 126, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 187, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 325, Texture: 0, Palette: 0 },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Prop.Hat] + 3,
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
        [HAZMAT_OUTFIT_NAME]: {
            Components: {
                [Component.Mask]: { Drawable: 46, Texture: 0, Palette: 0 },
                [Component.Torso]: { Drawable: 101, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 40, Texture: 0, Palette: 0 },
                [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 43, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 61, Texture: 0, Palette: 0 },
            },
            Props: { [0]: { Clear: true } },
        },
        ['Tenue Hiver']: {
            Components: {
                [Component.Torso]: { Drawable: 106, Texture: 0, Palette: 0 },
                [Component.Legs]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Legs] + 4,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                [Component.Accessories]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Accessories],
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Undershirt]: { Drawable: 217, Texture: 11, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[joaat('mp_f_freemode_01')][Component.Tops] + 6,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {},
        },
    },
};

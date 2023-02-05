import { Component, Prop, WardrobeConfig } from '../cloth';
import { Vector3, Vector4 } from '../polyzone/vector';

export const PHARMACY_PRICES = {
    tissue: 250,
    antibiotic: 250,
    pommade: 250,
    painkiller: 250,
    antiacide: 250,
    heal: 400,
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
    [GetHashKey('mp_m_freemode_01')]: {
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
                [Component.Tops]: { Drawable: 104, Texture: 0, Palette: 0 },
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
    [GetHashKey('mp_f_freemode_01')]: {
        ['Patient']: {
            Components: {
                [Component.Mask]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 21, Texture: 0, Palette: 0 },
                [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 35, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 95, Texture: 0, Palette: 0 },
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

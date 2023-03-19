import { Component, WardrobeConfig } from '../cloth';

export const CjrCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        ['Tenue de service']: {
            Components: {
                [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 27, Texture: 2, Palette: 0 },
                [Component.Undershirt]: { Drawable: 6, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 11, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 22, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 24, Texture: 5, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 139, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de direction']: {
            Components: {
                [Component.Torso]: { Drawable: 12, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 28, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 27, Texture: 2, Palette: 0 },
                [Component.Undershirt]: { Drawable: 33, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 31, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        ['Tenue de service']: {
            Components: {
                [Component.Torso]: { Drawable: 28, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 54, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 23, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 185, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 334, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 23, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 37, Texture: 5, Palette: 0 },
                [Component.Shoes]: { Drawable: 29, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 103, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue de direction']: {
            Components: {
                [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 54, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 40, Texture: 2, Palette: 0 },
                [Component.Tops]: { Drawable: 7, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
    },
};

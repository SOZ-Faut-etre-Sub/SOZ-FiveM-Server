import { joaat } from '@public/shared/joaat';

import { Component, WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
import { Feature } from '../features';
import { NamedZone } from '../polyzone/box.zone';

export const CraftZones: NamedZone[] = [
    {
        name: 'pawl_craft_1',
        center: [-523.25, 5288.06, 74.21],
        length: 1.0,
        width: 1.8,
        heading: 75,
        minZ: 73.21,
        maxZ: 75.86,
    },
    {
        name: 'pawl_craft_2',
        center: [-524.71, 5283.68, 74.17],
        length: 1.0,
        width: 1.8,
        heading: 235,
        minZ: 73.21,
        maxZ: 75.86,
    },
    {
        name: 'pawl_craft_3',
        center: [-533.17, 5293.16, 74.17],
        length: 1.0,
        width: 1.8,
        heading: 179.59,
        minZ: 73.21,
        maxZ: 75.86,
    },
];

export const PawlCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ['Tenue Bucheron']: {
            Components: {
                [Component.Torso]: { Palette: 0, Texture: 4, Drawable: 145 },
                [Component.Legs]: { Palette: 0, Texture: 8, Drawable: 90 },
                [Component.Shoes]: { Palette: 0, Texture: 0, Drawable: 81 },
                [Component.Accessories]: { Palette: 0, Texture: 0, Drawable: 0 },
                [Component.Undershirt]: { Palette: 0, Texture: 0, Drawable: 18 },
                [Component.BodyArmor]: { Palette: 0, Texture: 0, Drawable: 0 },
                [Component.Decals]: { Palette: 0, Texture: 0, Drawable: 0 },
                [Component.Tops]: { Palette: 0, Texture: 19, Drawable: 234 },
            },
            Props: {},
        },
        ['Chef Bucheron']: {
            Components: {
                [Component.Torso]: { Palette: 0, Texture: 4, Drawable: 145 },
                [Component.Legs]: { Palette: 0, Texture: 3, Drawable: 98 },
                [Component.Shoes]: { Palette: 0, Texture: 0, Drawable: 81 },
                [Component.Accessories]: { Palette: 0, Texture: 0, Drawable: 0 },
                [Component.Undershirt]: { Palette: 0, Texture: 0, Drawable: 18 },
                [Component.BodyArmor]: { Palette: 0, Texture: 0, Drawable: 0 },
                [Component.Decals]: { Palette: 0, Texture: 0, Drawable: 0 },
                [Component.Tops]: { Palette: 0, Texture: 19, Drawable: 234 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 139, Texture: 8, Palette: 0 },
                [Component.Legs]: { Drawable: 125, Texture: 6, Palette: 0 },
                [Component.Shoes]: { Drawable: 71, Texture: 17, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 30, Texture: 9, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 244, Texture: 13, Palette: 0 },
            },
            Props: {},
        },
        ['Ifécho']: {
            Components: {
                [Component.Torso]: { Drawable: 184, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 59, Texture: 22, Palette: 0 },
                [Component.Undershirt]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 346, Texture: 19, Palette: 0 },
            },
            Props: {},
            GlovesID: 56031,
        },
    },
    [joaat('mp_f_freemode_01')]: {
        ['Tenue Bucheron']: {
            Components: {
                [Component.Torso]: { Texture: 4, Drawable: 179, Palette: 0 },
                [Component.Legs]: { Texture: 8, Drawable: 93, Palette: 0 },
                [Component.Shoes]: { Texture: 0, Drawable: 86, Palette: 0 },
                [Component.Accessories]: { Texture: 0, Drawable: 0, Palette: 0 },
                [Component.Undershirt]: { Texture: 20, Drawable: 0, Palette: 0 },
                [Component.BodyArmor]: { Texture: 0, Drawable: 0, Palette: 0 },
                [Component.Decals]: { Texture: 0, Drawable: 0, Palette: 0 },
                [Component.Tops]: { Texture: 19, Drawable: 244, Palette: 0 },
            },
            Props: {},
        },
        ['Chef Bucheron']: {
            Components: {
                [Component.Torso]: { Texture: 4, Drawable: 179, Palette: 0 },
                [Component.Legs]: { Texture: 3, Drawable: 101, Palette: 0 },
                [Component.Shoes]: { Texture: 0, Drawable: 86, Palette: 0 },
                [Component.Accessories]: { Texture: 0, Drawable: 0, Palette: 0 },
                [Component.Undershirt]: { Texture: 20, Drawable: 2, Palette: 0 },
                [Component.BodyArmor]: { Texture: 0, Drawable: 0, Palette: 0 },
                [Component.Decals]: { Texture: 0, Drawable: 0, Palette: 0 },
                [Component.Tops]: { Texture: 19, Drawable: 244, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 171, Texture: 8, Palette: 0 },
                [Component.Legs]: { Drawable: 131, Texture: 6, Palette: 0 },
                [Component.Shoes]: { Drawable: 74, Texture: 17, Palette: 0 },
                [Component.Accessories]: { Drawable: 15, Texture: 2, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 252, Texture: 13, Palette: 0 },
            },
            Props: {},
        },
        ['Ifécho']: {
            Components: {
                [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 62, Texture: 22, Palette: 0 },
                [Component.Undershirt]: { Drawable: 151, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 364, Texture: 19, Palette: 0 },
            },
            Props: {},
            GlovesID: 55031,
        },
    },
};

export enum DegradationLevel {
    Green,
    Yellow,
    Red,
}

import { Component, WardrobeConfig } from '../cloth';
import { CraftCategory } from '../craft/craft';
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
    [GetHashKey('mp_m_freemode_01')]: {
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
                [Component.Torso]: { Drawable: 145, Texture: 4, Palette: 0 },
                [Component.Legs]: { Drawable: 97, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 70, Texture: 2, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 251, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
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
                [Component.Torso]: { Drawable: 179, Texture: 4, Palette: 0 },
                [Component.Legs]: { Drawable: 100, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 73, Texture: 2, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 259, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
    },
};

export const PawlCraftsLists: Record<string, CraftCategory> = {
    Objets: {
        duration: 15000,
        animation: {
            dictionary: 'mp_arresting',
            name: 'a_uncuff',
            options: {
                onlyUpperBody: true,
                repeat: true,
            },
        },
        recipes: {
            police_barrier: {
                inputs: {
                    wood_plank: { count: 1 },
                },
                amount: 1,
            },
            paper: {
                inputs: {
                    wood_plank: { count: 1 },
                },
                amount: 10,
            },
            empty_lunchbox: {
                inputs: {
                    wood_plank: { count: 1 },
                },
                amount: 4,
            },
            cabinet_zkea: {
                inputs: {
                    wood_plank: { count: 2 },
                },
                rewardTier: {
                    Divin: { id: 4, chance: GetConvarInt('soz_pawl_craft_chance_tier_4', 25) },
                    Sublime: { id: 3, chance: GetConvarInt('soz_pawl_craft_chance_tier_3', 25) },
                    Joli: { id: 2, chance: GetConvarInt('soz_pawl_craft_chance_tier_2', 25) },
                    Banal: { id: 1, chance: GetConvarInt('soz_pawl_craft_chance_tier_1', 25) },
                },
                amount: 1,
            },
            walkstick: {
                inputs: {
                    wood_plank: { count: 1 },
                },
                amount: 4,
            },
        },
    },
};

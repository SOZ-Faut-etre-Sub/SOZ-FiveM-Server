import { joaat } from '@public/shared/joaat';

import { WardrobeConfig } from '../cloth';
import { Vector3 } from '../polyzone/vector';

export const OilCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ["Tenue de pompiste d'été"]: {
            Components: {
                [3]: { Drawable: 2, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 16, Palette: 0 },
                [5]: { Drawable: 86, Texture: 18, Palette: 0 },
                [6]: { Drawable: 71, Texture: 16, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 247, Texture: 15, Palette: 0 },
            },
            Props: {},
            GlovesID: 56000,
        },
        ["Tenue de pompiste d'hiver"]: {
            Components: {
                [3]: { Drawable: 24, Texture: 0, Palette: 0 },
                [4]: { Drawable: 98, Texture: 16, Palette: 0 },
                [5]: { Drawable: 86, Texture: 18, Palette: 0 },
                [6]: { Drawable: 71, Texture: 16, Palette: 0 },
                [8]: { Drawable: 44, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 244, Texture: 18, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue de responsable d'été"]: {
            Components: {
                [3]: { Drawable: 0, Texture: 0, Palette: 0 },
                [4]: { Drawable: 97, Texture: 16, Palette: 0 },
                [5]: { Drawable: 86, Texture: 18, Palette: 0 },
                [6]: { Drawable: 70, Texture: 16, Palette: 0 },
                [8]: { Drawable: 15, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 345, Texture: 0, Palette: 0 },
            },
            Props: {},
            GlovesID: 56000,
        },
        ["Tenue de responsable d'hiver"]: {
            Components: {
                [3]: { Drawable: 20, Texture: 0, Palette: 0 },
                [4]: { Drawable: 97, Texture: 16, Palette: 0 },
                [5]: { Drawable: 86, Texture: 18, Palette: 0 },
                [6]: { Drawable: 70, Texture: 16, Palette: 0 },
                [8]: { Drawable: 44, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 251, Texture: 16, Palette: 0 },
            },
            Props: {},
        },
    },
    [joaat('mp_f_freemode_01')]: {
        ["Tenue de pompiste d'été"]: {
            Components: {
                [3]: { Drawable: 11, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 16, Palette: 0 },
                [5]: { Drawable: 86, Texture: 18, Palette: 0 },
                [6]: { Drawable: 74, Texture: 16, Palette: 0 },
                [8]: { Drawable: 0, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 255, Texture: 15, Palette: 0 },
            },
            Props: {},
            GlovesID: 55000,
        },
        ["Tenue de pompiste d'hiver"]: {
            Components: {
                [3]: { Drawable: 25, Texture: 0, Palette: 0 },
                [4]: { Drawable: 101, Texture: 16, Palette: 0 },
                [5]: { Drawable: 86, Texture: 18, Palette: 0 },
                [6]: { Drawable: 74, Texture: 16, Palette: 0 },
                [8]: { Drawable: 98, Texture: 1, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 252, Texture: 18, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue de responsable d'été"]: {
            Components: {
                [3]: { Drawable: 14, Texture: 0, Palette: 0 },
                [4]: { Drawable: 100, Texture: 16, Palette: 0 },
                [5]: { Drawable: 86, Texture: 18, Palette: 0 },
                [6]: { Drawable: 73, Texture: 16, Palette: 0 },
                [8]: { Drawable: 2, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 141, Texture: 2, Palette: 0 },
            },
            Props: {},
            GlovesID: 55000,
        },
        ["Tenue de responsable d'hiver"]: {
            Components: {
                [3]: { Drawable: 23, Texture: 0, Palette: 0 },
                [4]: { Drawable: 100, Texture: 16, Palette: 0 },
                [5]: { Drawable: 86, Texture: 18, Palette: 0 },
                [6]: { Drawable: 73, Texture: 16, Palette: 0 },
                [8]: { Drawable: 2, Texture: 0, Palette: 0 },
                [9]: { Drawable: 0, Texture: 0, Palette: 0 },
                [10]: { Drawable: 0, Texture: 0, Palette: 0 },
                [11]: { Drawable: 259, Texture: 16, Palette: 0 },
            },
            Props: {},
        },
    },
};

export type OilField = {
    production: { min: number; max: number };
    delay: number;
    item: string;
    zone: Vector3[];
};

export const OIL_FIELDS: Record<string, OilField> = {
    oil_field_petrol1: {
        production: { min: 600, max: 1260 },
        delay: 16000,
        item: 'petroleum',
        zone: [
            [476.27612304688, 2986.7197265625, 37.55],
            [483.51190185546, 2926.3686523438, 37.55],
            [509.33477783204, 2909.2048339844, 37.55],
            [533.97302246094, 2839.9375, 37.55],
            [727.41925048828, 2845.6423339844, 55.55],
            [665.96124267578, 3053.6645507812, 55.55],
            [588.5396118164, 3042.2253417968, 55.55],
        ],
    },
    oil_field_petrol2: {
        production: { min: 600, max: 1260 },
        delay: 16000,
        item: 'petroleum',
        zone: [
            [1343.3212890625, -2243.3898925782, 61.48],
            [1356.2628173828, -2298.9008789062, 61.48],
            [1366.0158691406, -2353.48828125, 61.48],
            [1419.2153320312, -2345.9350585938, 61.48],
            [1462.712524414, -2347.0263671875, 61.48],
            [1452.5794677734, -2307.3266601562, 61.48],
            [1489.618774414, -2279.5280761718, 71.95],
            [1496.968383789, -2250.1540527344, 71.95],
            [1450.2510986328, -2238.0737304688, 71.95],
            [1385.1121826172, -2235.2758789062, 71.95],
        ],
    },
};

export type MenuOilData = {
    showOilFields: boolean;
    showRefinery: boolean;
    showReseller: boolean;
};

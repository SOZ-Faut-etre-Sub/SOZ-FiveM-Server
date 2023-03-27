import { Component, Prop, WardrobeConfig } from '../cloth';
import { VanillaComponentDrawableIndexMaxValue, VanillaPropDrawableIndexMaxValue } from '../drawable';
import { NamedZone } from '../polyzone/box.zone';

export type StonkBagType = 'jewelbag' | 'small_moneybag' | 'medium_moneybag' | 'big_moneybag';

const resellZones: (NamedZone & { bagAccepted: StonkBagType })[] = [
    {
        name: 'Lombank',
        center: [-880.35, -194.65, 38.38],
        length: 0.4,
        width: 2.6,
        heading: 295,
        minZ: 37.38,
        maxZ: 40.78,
        bagAccepted: 'small_moneybag',
    },
    {
        name: 'MAZE_Bank',
        center: [-1381.23, -498.95, 33.16],
        length: 0.4,
        width: 5.4,
        heading: 8,
        minZ: 31.11,
        maxZ: 35.11,
        bagAccepted: 'medium_moneybag',
    },
    {
        name: 'Lombank_HQ',
        center: [-693.44, -581.7, 31.55],
        length: 0.6,
        width: 7.2,
        heading: 0,
        minZ: 29.75,
        maxZ: 33.75,
        bagAccepted: 'big_moneybag',
    },
    {
        name: 'Jewelry_Exchange',
        center: [301.56, -884.64, 29.24],
        length: 0.4,
        width: 4.6,
        heading: 250,
        minZ: 27.44,
        maxZ: 31.44,
        bagAccepted: 'jewelbag',
    },
];

const deliveryZones: NamedZone[] = [
    {
        name: 'BOLINGBROKE PENITENTIARY',
        center: [1845.43, 2585.9, 45.67],
        length: 0.2,
        width: 1.4,
        heading: 270,
        minZ: 43.32,
        maxZ: 47.32,
    },
    {
        name: 'HUMANE LABS & RESEARCH',
        center: [3433.04, 3756.55, 30.5],
        length: 0.4,
        width: 1.6,
        heading: 28,
        minZ: 28.1,
        maxZ: 32.1,
    },
    {
        name: 'LAGO ZANCUDO',
        center: [-2304.24, 3426.83, 31.01],
        length: 0.4,
        width: 1.4,
        heading: 230,
        minZ: 28.66,
        maxZ: 32.66,
    },
];

export const StonkConfig = {
    bankAccount: {
        main: 'cash-transfer',
        safe: 'safe_cash-transfer',
        farm: 'farm_stonk',
        bankRefill: 'bank_refill',
    },
    collection: {
        jewelbag: {
            refill_value: null,
            society_gain: 960,
            timeout: 24 * 60 * 60 * 1000,
            takeInAvailableIn: ['jewelry'],
        },
        small_moneybag: {
            refill_value: 3000,
            society_gain: 60,
            timeout: 10 * 60 * 1000,
            takeInAvailableIn: [
                'binco',
                'tattoo',
                'barber',
                '247supermarket-north',
                'ltdgasoline-north',
                'robsliquor-north',
            ],
        },
        medium_moneybag: {
            refill_value: 5000,
            society_gain: 120,
            timeout: 20 * 60 * 1000,
            takeInAvailableIn: [
                'suburban',
                'ammunation',
                '247supermarket-south',
                'ltdgasoline-south',
                'robsliquor-south',
            ],
        },
        big_moneybag: {
            refill_value: 8000,
            society_gain: 240,
            timeout: 30 * 60 * 1000,
            takeInAvailableIn: ['ponsonbys'],
        },
    },
    resell: {
        collectionDuration: 15 * 1000,
        duration: 5 * 1000,
        amount: 5,
        zones: resellZones,
    },
    delivery: {
        item: 'stonk__secure_container',
        duration: 45 * 1000,
        society_gain: 6000,
        location: deliveryZones,
    },
};

export const DUTY_OUTFIT_NAME = 'Tenue de service';

export const StonkCloakroom: WardrobeConfig = {
    [GetHashKey('mp_m_freemode_01')]: {
        [DUTY_OUTFIT_NAME]: {
            Components: {
                [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                [Component.Legs]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 2,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Shoes]: { Drawable: 54, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                [Component.Undershirt]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Undershirt] + 1,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Decals] + 3,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 5,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat],
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
        ['Tenue VIP']: {
            Components: {
                [1]: { Drawable: 121, Texture: 0, Palette: 0 },
                [Component.Torso]: { Drawable: 12, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 29, Texture: 2, Palette: 0 },
                [Component.Undershirt]: { Drawable: 31, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 31, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue Direction']: {
            Components: {
                [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 24, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 20, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 34, Texture: 1, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 29, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue Hiver']: {
            Components: {
                [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                [Component.Legs]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Legs] + 2,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Shoes]: { Drawable: 54, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                [Component.Undershirt]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Undershirt] + 1,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Decals] + 3,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Component.Tops] + 9,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_m_freemode_01')][Prop.Hat],
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
    },
    [GetHashKey('mp_f_freemode_01')]: {
        [DUTY_OUTFIT_NAME]: {
            Components: {
                [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.Legs]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 2,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Shoes]: { Drawable: 55, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                [Component.Undershirt]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Undershirt] + 1,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Decals] + 3,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 5,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat],
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
        ['Tenue VIP']: {
            Components: {
                [1]: { Drawable: 121, Texture: 0, Palette: 0 },
                [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 133, Texture: 0, Palette: 0 },
                [Component.Shoes]: { Drawable: 29, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 22, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 216, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 339, Texture: 0, Palette: 0 },
            },
            Props: {},
        },
        ['Tenue Direction']: {
            Components: {
                [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 37, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 29, Texture: 1, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 40, Texture: 4, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 57, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
        ['Tenues Hiver']: {
            Components: {
                [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                [Component.Legs]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Legs] + 2,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Shoes]: { Drawable: 55, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 8, Texture: 0, Palette: 0 },
                [Component.Undershirt]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Undershirt] + 1,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: {
                    Drawable:
                        VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Decals] + 3,
                    Texture: 0,
                    Palette: 0,
                },
                [Component.Tops]: {
                    Drawable: VanillaComponentDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Component.Tops] + 9,
                    Texture: 0,
                    Palette: 0,
                },
            },
            Props: {
                [Prop.Hat]: {
                    Drawable: VanillaPropDrawableIndexMaxValue[GetHashKey('mp_f_freemode_01')][Prop.Hat],
                    Texture: 0,
                    Palette: 0,
                },
            },
        },
    },
};

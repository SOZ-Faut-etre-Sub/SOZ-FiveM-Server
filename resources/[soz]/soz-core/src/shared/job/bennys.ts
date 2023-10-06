import { Component, WardrobeConfig } from '../cloth';
import { joaat } from '../joaat';
import { NamedZone } from '../polyzone/box.zone';
import { getDefaultVehicleConfiguration, VehicleConfiguration } from '../vehicle/modification';

const orderZone: NamedZone = {
    name: 'bennys_order',
    center: [-203.94, -1337.64, 34.89],
    length: 0.15,
    width: 0.55,
    minZ: 34.49,
    maxZ: 35.09,
    heading: 0,
    debugPoly: false,
};

const defaultUpgradeConfiguration: VehicleConfiguration = {
    ...getDefaultVehicleConfiguration(),
    modification: {
        armor: 4,
        brakes: 2,
        engine: 3,
        transmission: 2,
        turbo: true,
    },
};

const carResellZone: NamedZone = {
    name: 'bennys_resell_car',
    center: [260.77, 2578.32, 45.1],
    length: 5.8,
    width: 9.8,
    minZ: 44.1,
    maxZ: 49.1,
    heading: 10,
};
const boatResellZone: NamedZone = {
    name: 'bennys_resell_boat',
    center: [3375.48, 5181.24, -0.43],
    length: 15.8,
    width: 14.8,
    minZ: -1.43,
    maxZ: 5.57,
    heading: 82.78,
};
const heliResellZone: NamedZone = {
    name: 'bennys_resell_heli',
    center: [2135.2, 4810.26, 41.05],
    length: 29.6,
    width: 22.2,
    minZ: 40.05,
    maxZ: 45.65,
    heading: 113.97,
};

export const BennysConfig = {
    Estimate: {
        duration: 5000,
    },
    UpgradeConfiguration: defaultUpgradeConfiguration,
    Order: {
        zone: orderZone,
        waitingTime: 60, // In minutes
    },
    Resell: [
        {
            label: 'Vendre (Terrestre)',
            zone: carResellZone,
            types: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 20, 21, 22],
        },
        {
            label: 'Vendre (Aquatique)',
            zone: boatResellZone,
            types: [14],
        },
        {
            label: 'Vendre (Aérien)',
            zone: heliResellZone,
            types: [15, 16],
        },
    ],
};

export type BennysOrder = {
    uuid: string;
    model: string;
    orderDate: string;
};

export const NewGarrayCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ['Direction']: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 17, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 351, Texture: 9, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano']: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 0, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Apprenti']: {
            Components: {
                [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 39, Texture: 1, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 66, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 22, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 31, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 139, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
    },
    [joaat('mp_f_freemode_01')]: {
        ['Direction']: {
            Components: {
                [Component.Torso]: { Drawable: 31, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 17, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 377, Texture: 5, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano']: {
            Components: {
                [Component.Torso]: { Drawable: 31, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 49, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ['Apprenti']: {
            Components: {
                [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 39, Texture: 1, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 60, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ["Tenue d'hiver"]: {
            Components: {
                [Component.Torso]: { Drawable: 23, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 30, Texture: 2, Palette: 0 },
                [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 103, Texture: 3, Palette: 0 },
            },
            Props: {},
        },
    },
};

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

const resellZone: NamedZone = {
    name: 'bennys_resell',
    center: [260.77, 2578.32, 45.1],
    length: 5.8,
    width: 9.8,
    minZ: 44.1,
    maxZ: 49.1,
    heading: 10,
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
    Resell: {
        zone: resellZone,
    },
};

export type BennysOrder = {
    uuid: string;
    model: string;
    orderDate: string;
};

export const NewGarrayCloakroom: WardrobeConfig = {
    [joaat('mp_m_freemode_01')]: {
        ['Patron']: {
            Components: {
                [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
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
        ["Chef d'atelier"]: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 146, Texture: 2, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano confirmé']: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 64, Texture: 13, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 146, Texture: 3, Palette: 0 },
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
        ['Mécano novice']: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 64, Texture: 13, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 208, Texture: 18, Palette: 0 },
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
        ["Responsable d'atelier"]: {
            Components: {
                [Component.Torso]: { Drawable: 19, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 98, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 46, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 47, Texture: 0, Palette: 0 },
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
        ['Patron']: {
            Components: {
                [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
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
        ["Chef d'atelier"]: {
            Components: {
                [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 338, Texture: 7, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano confirmé']: {
            Components: {
                [Component.Torso]: { Drawable: 31, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 67, Texture: 13, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 141, Texture: 5, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano']: {
            Components: {
                [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 73, Texture: 1, Palette: 0 },
            },
            Props: {},
        },
        ['Mécano novice']: {
            Components: {
                [Component.Torso]: { Drawable: 31, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 67, Texture: 13, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 212, Texture: 18, Palette: 0 },
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
        ["Responsable d'atelier"]: {
            Components: {
                [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                [Component.Legs]: { Drawable: 101, Texture: 3, Palette: 0 },
                [Component.Shoes]: { Drawable: 47, Texture: 3, Palette: 0 },
                [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0 },
                [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                [Component.Tops]: { Drawable: 338, Texture: 9, Palette: 0 },
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

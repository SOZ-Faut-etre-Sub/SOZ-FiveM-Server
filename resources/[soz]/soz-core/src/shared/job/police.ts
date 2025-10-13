import { SozRole } from '@public/core/permissions';

import { Component, CustomWardrobe, OutfitItem, Prop, WardrobeConfig, WardRobeElements } from '../cloth';
import { joaat } from '../joaat';
import { JobType } from '../job';
import { PlayerLicenceType, PlayerPedHash } from '../player';
import { Vector4 } from '../polyzone/vector';

export const DUTY_OUTFIT_NAME = 'Tenue de service';
export const WINTER = 'Tenue Hiver';
export const SASP_DARK = 'Tenue sombre';
export const MOTO = 'Tenue de moto';
export const PILOT = 'Tenue de pilote';
export const BLOUSON = 'BLOUSON';
export const BLOUSON_SANSCOL = 'BLOUSON_SANSCOL';
export const TSHIRT = 'TSHIRT';
export const RAINCOAT = 'RAINCOAT';
export const COAT = 'COAT';
export const POLO = 'POLO';
export const PULL = 'PULL';

export const PrisonerClothes = {
    [PlayerPedHash.Male]: {
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
        GlovesID: 0,
    },
    [PlayerPedHash.Female]: {
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
        GlovesID: 0,
    },
};

export const POLICE_CLOAKROOM: Partial<Record<JobType, WardrobeConfig>> = {
    [JobType.LSPD]: {
        [PlayerPedHash.Male]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
                rankType: DUTY_OUTFIT_NAME,
            },
            [WINTER]: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
                rankType: WINTER,
            },
            [PILOT]: {
                Components: {
                    [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 5, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
            },
            [MOTO]: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                GlovesID: 56000,
                category: 'Original',
                rankType: MOTO,
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Decals]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                },
                Props: {},
                category: 'Original',
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 12, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                type: 'SPORT',
                category: 'Original',
            },
            ['Cérémonie']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 13, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 16, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 19, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 18, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['T-Shirt Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Motocycle Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Air Support Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['Polo Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Blouson Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON_SANSCOL,
            },
            ['Blouson K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON_SANSCOL,
            },
            ['Blouson Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON_SANSCOL,
            },
            ['Blouson Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON_SANSCOL,
            },
            ['Sweat']: {
                Components: {
                    [Component.Torso]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 28, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Tenue de pilote 2']: {
                Components: {
                    [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 5, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 30, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 15, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Chemise blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise bleue marine']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise bleue']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise m. courte Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise m. courte K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise m. courte Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise m. courte Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Pull Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Patrol 2']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Pull K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Imperméable capuche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 36, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                category: 'Modern',
                rankType: RAINCOAT,
            },
            ['Imperméable']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 35, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: RAINCOAT,
            },
            ['Hiver Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 37, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 37, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 37, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 37, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Chemise Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 38, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Chemise K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 38, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Chemise Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 38, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Chemise Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 38, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Blouson col Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson col K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson col Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson col Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson col Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Manteau ouvert Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 11, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 40, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 11, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 40, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 11, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 40, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 11, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 40, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Chemise épaulette m. courte blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 41, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette m. courte bleue marine']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 41, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette m. courte bleue']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 41, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette m. courte noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 41, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette m. courte bleue-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 41, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 42, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette bleue marine']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 42, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette bleue']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 42, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 42, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette bleue-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 42, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette col noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 43, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette col blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 43, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette col K9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 43, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette col Cadet']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 43, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette cravate blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 44, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: MOTO,
            },
            ['Chemise épaulette cravate noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 44, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: MOTO,
            },
            ['Chemise épaulette cravate bleue marine']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 44, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: MOTO,
            },
            ['Chemise courte cravate blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 45, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate bleu']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 45, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate bleu 2']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 45, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate gris']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 45, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 45, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
        },
        [PlayerPedHash.Female]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
                rankType: DUTY_OUTFIT_NAME,
            },
            [WINTER]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
                rankType: WINTER,
            },
            [PILOT]: {
                Components: {
                    [Component.Torso]: { Drawable: 17, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 5, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
            },
            [MOTO]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                GlovesID: 55000,
                category: 'Original',
                rankType: MOTO,
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Decals]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                },
                Props: {},
                category: 'Original',
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 12, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                type: 'SPORT',
                category: 'Original',
            },
            ['Cérémonie']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 17, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 16, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Cérémonie jupe courte']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Bag]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 17, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 16, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Cérémonie jupe longue']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 7, Texture: 0, Palette: 0 },
                    [Component.Bag]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 17, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 16, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['T-Shirt Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 17, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Motocycle Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Air Support Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['Polo Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 26, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Blouson Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 32, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 32, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 32, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 32, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 32, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Chemise blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise bleue marine']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise bleue marine 2']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise bleue marine 3']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise bleue-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise cravate blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 28, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise cravate noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 28, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise cravate bleue-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 28, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Imperméable capuche']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 29, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                category: 'Modern',
                rankType: RAINCOAT,
            },
            ['Imperméable']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 30, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: RAINCOAT,
            },
            ['Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Manteau ouvert Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 33, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert Vice']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 33, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 33, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert K9']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 33, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Chemise courte blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte bleue']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte bleue 2']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte gris']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte bleue-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 16, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 34, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate bleu']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 34, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate bleu 2']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 34, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate gris']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 34, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 34, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate bleue-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    [Component.Tops]: { Drawable: 34, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
        },
    },
    [JobType.BCSO]: {
        [PlayerPedHash.Male]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
                rankType: DUTY_OUTFIT_NAME,
            },
            [WINTER]: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
                rankType: WINTER,
            },
            [PILOT]: {
                Components: {
                    [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 5, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 4, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
            },
            [MOTO]: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 3, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                GlovesID: 56000,
                category: 'Original',
                rankType: MOTO,
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Decals]: {
                        Drawable: 4,
                        Texture: 1,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                },
                Props: {},
                category: 'Original',
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 10, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 12, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                type: 'SPORT',
                category: 'Original',
            },
            ['Cérémonie']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 16, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 13, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['T-Shirt Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Motocycle Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Air Support Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 18, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['Polo Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Blouson Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON_SANSCOL,
            },
            ['Blouson K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON_SANSCOL,
            },
            ['Blouson Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON_SANSCOL,
            },
            ['Blouson Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON_SANSCOL,
            },
            ['Sweat']: {
                Components: {
                    [Component.Torso]: { Drawable: 8, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 28, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Tenue de pilote 2']: {
                Components: {
                    [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 5, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 30, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Chemise blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise verte']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise m. courte Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise m. courte K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise m. courte Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise m. courte Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Pull Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Patrol 2']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Pull Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 33, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: PULL,
            },
            ['Imperméable capuche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 36, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                category: 'Modern',
                rankType: RAINCOAT,
            },
            ['Imperméable']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 35, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: RAINCOAT,
            },
            ['Hiver Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 37, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 37, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 37, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 37, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Chemise Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 38, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Chemise K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 38, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Chemise Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 38, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Hiver Chemise Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 38, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Blouson col Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson col K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson col Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson col Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson col Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 39, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Manteau ouvert Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 11, Texture: 1, Palette: 0 },
                    [Component.Tops]: { Drawable: 40, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 11, Texture: 1, Palette: 0 },
                    [Component.Tops]: { Drawable: 40, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 11, Texture: 1, Palette: 0 },
                    [Component.Tops]: { Drawable: 40, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 11, Texture: 1, Palette: 0 },
                    [Component.Tops]: { Drawable: 40, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Chemise épaulette m. courte blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 41, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette m. courte verte']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 41, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette m. courte noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 41, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 42, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette verte']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 42, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 42, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette col noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 43, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette col blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 43, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette col K9']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 43, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette col Cadet']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 43, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise épaulette cravate blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 44, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: MOTO,
            },
            ['Chemise épaulette cravate verte']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 44, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: MOTO,
            },
            ['Chemise épaulette cravate noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 44, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: MOTO,
            },
            ['Chemise courte cravate blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 45, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate gris']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 45, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 45, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
        },
        [PlayerPedHash.Female]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 4, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
                rankType: DUTY_OUTFIT_NAME,
            },
            [WINTER]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
                rankType: WINTER,
            },
            [PILOT]: {
                Components: {
                    [Component.Torso]: { Drawable: 36, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 5, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 4, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Original',
            },
            [MOTO]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 3, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                GlovesID: 55000,
                category: 'Original',
                rankType: MOTO,
            },
            ['Equipement seulement']: {
                Components: {
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Decals]: {
                        Drawable: 4,
                        Texture: 1,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                },
                Props: {},
                category: 'Original',
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 10, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 12, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                type: 'SPORT',
                category: 'Original',
            },
            ['Cérémonie']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 14, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 19, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 17, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 13, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Cérémonie jupe courte']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 17, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 19, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 17, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 13, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['Cérémonie jupe longue']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 16, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 19, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 6, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 17, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 13, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
            },
            ['T-Shirt Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 16, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Motocycle Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Air Support Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 19, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['T-Shirt Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 20, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: TSHIRT,
            },
            ['Polo Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 22, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 21, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 24, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manchon Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 23, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Traffic Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Marine Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Wildlife Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Training Team']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 26, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Polo manche courte Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 25, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: POLO,
            },
            ['Blouson Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson K-9']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson Vice Unit']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Blouson Cadets']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 32, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: BLOUSON,
            },
            ['Chemise blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise verte']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 27, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise cravate blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 28, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise cravate verte']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 28, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise cravate noire-dorée']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 28, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Imperméable capuche']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 29, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                category: 'Modern',
                rankType: RAINCOAT,
            },
            ['Imperméable']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 30, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: RAINCOAT,
            },
            ['Hiver']: {
                Components: {
                    [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 31, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: WINTER,
            },
            ['Manteau ouvert Patrol']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 1, Palette: 0 },
                    [Component.Tops]: { Drawable: 33, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert Vice']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 1, Palette: 0 },
                    [Component.Tops]: { Drawable: 33, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert Supervisor']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 1, Palette: 0 },
                    [Component.Tops]: { Drawable: 33, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Manteau ouvert K9']: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 39, Texture: 1, Palette: 0 },
                    [Component.Tops]: { Drawable: 33, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: COAT,
            },
            ['Chemise courte blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 4, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte verte']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 4, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 4, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate blanche']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate verte']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Chemise courte cravate noir-doré']: {
                Components: {
                    [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Tops]: { Drawable: 34, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                category: 'Modern',
                rankType: DUTY_OUTFIT_NAME,
            },
        },
    },
    [JobType.SASP]: {
        [PlayerPedHash.Male]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 2, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                GlovesID: 56000,
                rankType: DUTY_OUTFIT_NAME,
            },
            [SASP_DARK]: {
                Components: {
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 2, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                GlovesID: 56000,
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 10, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 12, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                type: 'SPORT',
            },
        },
        [PlayerPedHash.Female]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 1, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 2, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                GlovesID: 55000,
                rankType: DUTY_OUTFIT_NAME,
            },
            [SASP_DARK]: {
                Components: {
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 2, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Hat]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                GlovesID: 55000,
                rankType: DUTY_OUTFIT_NAME,
            },
            ['Tenue Sportive']: {
                Components: {
                    [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 10, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 12, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {},
                type: 'SPORT',
            },
        },
    },
    [JobType.LSCS]: {
        [PlayerPedHash.Male]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: 35,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: 0,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 60, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: {
                        Drawable: 58,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: 55,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: 46,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
        },
        [PlayerPedHash.Female]: {
            [DUTY_OUTFIT_NAME]: {
                Components: {
                    [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.Legs]: {
                        Drawable: 34,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Bag]: {
                        Drawable: 0,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 4,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: {
                        Drawable: 35,
                        Texture: 0,
                        Palette: 0,
                    },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: {
                        Drawable: 48,
                        Texture: 0,
                        Palette: 0,
                    },
                },
                Props: {
                    [Prop.Hat]: {
                        Drawable: 45,
                        Texture: 0,
                        Palette: 0,
                    },
                },
            },
        },
    },
};

export const POLICE_CUSTOM_CLOAKROOM: Partial<Record<JobType, Record<PlayerPedHash, CustomWardrobe>>> = {
    [JobType.LSPD]: {
        [PlayerPedHash.Male]: {
            [WardRobeElements.Helmet]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Helmet]: { Clear: true },
                    },
                },
                [MOTO]: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote 1']: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote 2']: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 18, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Hat]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Hat]: { Clear: true },
                    },
                },
                ['Casquette']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 19, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Top]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                [WINTER]: {
                    Components: {
                        [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                [PILOT]: {
                    Components: {
                        [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    GlovesID: 56000,
                    rankType: MOTO,
                },
                ['Equipement seulement']: {
                    Components: {
                        [Component.Decals]: {
                            Drawable: 4,
                            Texture: 0,
                            Palette: 0,
                            Collection: 'soz_bcso',
                        },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 12, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 13, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 16, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['T-Shirt Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Motocycle Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Air Support Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['Polo Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Blouson Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 27, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON_SANSCOL,
                },
                ['Blouson K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 27, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON_SANSCOL,
                },
                ['Blouson Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 27, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON_SANSCOL,
                },
                ['Blouson Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 27, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON_SANSCOL,
                },
                ['Sweat']: {
                    Components: {
                        [Component.Torso]: { Drawable: 8, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 28, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Tenue de pilote 2']: {
                    Components: {
                        [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 30, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Chemise blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 31, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise bleue marine']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 31, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise bleue']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 31, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 31, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise m. courte Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise m. courte K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise m. courte Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise m. courte Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Pull Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Patrol 2']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 34, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 34, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 34, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Imperméable capuche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 36, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: RAINCOAT,
                },
                ['Imperméable']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 35, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: RAINCOAT,
                },
                ['Hiver Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 37, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 37, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 37, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 37, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Chemise Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 38, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Chemise K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 38, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Chemise Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 38, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Chemise Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 38, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Blouson col Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson col K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson col Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson col Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson col Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Manteau ouvert Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 40, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 40, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 40, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 40, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Chemise épaulette m. courte blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 41, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette m. courte bleue marine']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 41, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette m. courte bleue']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 41, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette m. courte noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 41, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette m. courte bleue-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 41, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 42, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette bleue marine']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 42, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette bleue']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 42, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 42, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette bleue-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 42, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette col noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 43, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette col blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 43, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette col K9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 43, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette col Cadet']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 43, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette cravate blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 44, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: MOTO,
                },
                ['Chemise épaulette cravate noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 44, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: MOTO,
                },
                ['Chemise épaulette cravate bleue marine']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 44, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: MOTO,
                },
                ['Chemise courte cravate blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 45, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate bleu']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 45, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate bleu2']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 45, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate gris']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 45, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 45, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
            },
            [WardRobeElements.Accessory]: {
                ['Aucun']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    },
                },
                ['Holster']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Belt]: {
                ['Aucune']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    },
                },
                ['BCSO']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['LSPD']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Anti-Emeute']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Chemise anthracite ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 11, Texture: 2, Palette: 0 },
                    },
                },
                ['Chemise anthracite fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 10, Texture: 2, Palette: 0 },
                    },
                },
                ['Pull']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 72, Texture: 3, Palette: 0 },
                    },
                },
                ['Chemise noire fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 178, Texture: 4, Palette: 0 },
                    },
                },
                ['Chemise noire ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 179, Texture: 4, Palette: 0 },
                    },
                },
            },
            [WardRobeElements.Bottom]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [PILOT]: {
                    Components: {
                        [Component.Legs]: { Drawable: 5, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Legs]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Legs]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pantalon noir']: {
                    Components: {
                        [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Shoes]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    },
                },
            },
        },
        [PlayerPedHash.Female]: {
            [WardRobeElements.Helmet]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Helmet]: { Clear: true },
                    },
                },
                [MOTO]: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote 1']: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote 2']: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 15, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Hat]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Hat]: { Clear: true },
                    },
                },
                ['Casquette']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 0, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 16, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Top]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                [WINTER]: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                [PILOT]: {
                    Components: {
                        [Component.Torso]: { Drawable: 17, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    GlovesID: 55000,
                    rankType: MOTO,
                },
                ['Equipement seulement']: {
                    Components: {
                        [Component.Decals]: {
                            Drawable: 4,
                            Texture: 0,
                            Palette: 0,
                            Collection: 'soz_bcso',
                        },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 12, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 17, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['T-Shirt Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 17, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Motocycle Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Air Support Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['Polo Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 23, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 25, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 19, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 21, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 26, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Blouson Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 15, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 9, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Chemise blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 27, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise bleue marine']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 27, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise bleue marine 2']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 27, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise bleue marine 3']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 27, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 27, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise bleue-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 27, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise cravate blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 28, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise cravate noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 28, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise cravate bleue-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 28, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Imperméable capuche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 29, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: RAINCOAT,
                },
                ['Imperméable']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 30, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: RAINCOAT,
                },
                ['Hiver']: {
                    Components: {
                        [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 31, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Manteau ouvert Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert Vice']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert K9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Chemise courte blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte bleue']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte bleue 2']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte gris']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte bleue-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 16, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate bleu']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate bleu 2']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 5, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate gris']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 7, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate bleue-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
            },
            [WardRobeElements.Accessory]: {
                ['Aucun']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    },
                },
                ['Holster']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Belt]: {
                ['Aucune']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    },
                },
                ['BCSO']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['LSPD']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Anti-Emeute']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Chemise anthracite ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 39, Texture: 2, Palette: 0 },
                    },
                },
                ['Chemise anthracite fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 38, Texture: 2, Palette: 0 },
                    },
                },
                ['Pull']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 67, Texture: 3, Palette: 0 },
                    },
                },
                ['Chemise noire fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 216, Texture: 4, Palette: 0 },
                    },
                },
                ['Chemise noire ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 217, Texture: 4, Palette: 0 },
                    },
                },
            },
            [WardRobeElements.Bottom]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Legs]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [PILOT]: {
                    Components: {
                        [Component.Legs]: { Drawable: 5, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Legs]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Legs]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Components: {
                        [Component.Legs]: { Drawable: 14, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pantalon noir']: {
                    Components: {
                        [Component.Legs]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Jupe courte']: {
                    Components: {
                        [Component.Legs]: { Drawable: 8, Texture: 0, Palette: 0 },
                    },
                },
                ['Jupe longue']: {
                    Components: {
                        [Component.Legs]: { Drawable: 7, Texture: 0, Palette: 0 },
                    },
                },
            },
            [WardRobeElements.Shoes]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    },
                },
                [PILOT]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    },
                },
                ['Talons']: {
                    Components: {
                        [Component.Shoes]: { Drawable: 6, Texture: 0, Palette: 0 },
                    },
                },
            },
        },
    },
    [JobType.BCSO]: {
        [PlayerPedHash.Male]: {
            [WardRobeElements.Helmet]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Helmet]: { Clear: true },
                    },
                },
                [MOTO]: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote 1']: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 4, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote 2']: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 18, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Hat]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Hat]: { Clear: true },
                    },
                },
                ['Chapeau']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 13, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Top]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                [WINTER]: {
                    Components: {
                        [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                [PILOT]: {
                    Components: {
                        [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    GlovesID: 56000,
                    rankType: MOTO,
                },
                ['Equipement seulement']: {
                    Components: {
                        [Component.Decals]: {
                            Drawable: 4,
                            Texture: 1,
                            Palette: 0,
                            Collection: 'soz_bcso',
                        },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Torso]: { Drawable: 5, Texture: 0, Palette: 0 },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 12, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 16, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['T-Shirt Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Motocycle Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Air Support Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 18, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['Polo Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Blouson Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 27, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON_SANSCOL,
                },
                ['Blouson K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 27, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON_SANSCOL,
                },
                ['Blouson Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 27, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON_SANSCOL,
                },
                ['Blouson Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 27, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Sweat']: {
                    Components: {
                        [Component.Torso]: { Drawable: 8, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 28, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Tenue de pilote 2']: {
                    Components: {
                        [Component.Torso]: { Drawable: 16, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 30, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Chemise blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 31, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise verte']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 31, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    category: 'Modern',
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 31, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise m. courte Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise m. courte K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise m. courte Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise m. courte Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Pull Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Patrol 2']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 34, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 34, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 34, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Pull Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: PULL,
                },
                ['Imperméable capuche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 36, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: RAINCOAT,
                },
                ['Imperméable']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 35, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: RAINCOAT,
                },
                ['Hiver Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 37, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 37, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 37, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 6, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 37, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Chemise Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 38, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Chemise K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 38, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Chemise Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 38, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Hiver Chemise Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 38, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Blouson col Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson col K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson col Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson col Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson col Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 39, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Manteau ouvert Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 40, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 40, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 40, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 40, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Chemise épaulette m. courte blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 41, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette m. courte verte']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 41, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette m. courte noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 41, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 42, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette verte']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 42, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 42, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette col noire-dorée']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 43, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette col blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 43, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette col K9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 43, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette col Cadet']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 43, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise épaulette cravate blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 44, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: MOTO,
                },
                ['Chemise épaulette cravate verte']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 44, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: MOTO,
                },
                ['Chemise épaulette cravate noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 44, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: MOTO,
                },
                ['Chemise courte cravate blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 45, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate gris']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 45, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 45, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
            },
            [WardRobeElements.Accessory]: {
                ['Aucun']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    },
                },
                ['Holster']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Belt]: {
                ['Aucune']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    },
                },
                ['BCSO']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['LSPD']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Anti-Emeute']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Chemise grise ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 11, Texture: 1, Palette: 0 },
                    },
                },
                ['Chemise grise fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 10, Texture: 1, Palette: 0 },
                    },
                },
                ['Pull']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 72, Texture: 0, Palette: 0 },
                    },
                },
                ['Chemise verte fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 178, Texture: 7, Palette: 0 },
                    },
                },
                ['Chemise verte ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 179, Texture: 7, Palette: 0 },
                    },
                },
                ['Chemise verte claire fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 178, Texture: 5, Palette: 0 },
                    },
                },
                ['Chemise verte claire ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 179, Texture: 5, Palette: 0 },
                    },
                },
            },
            [WardRobeElements.Bottom]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [PILOT]: {
                    Components: {
                        [Component.Legs]: { Drawable: 5, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Legs]: { Drawable: 3, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Legs]: { Drawable: 10, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pantalon vert']: {
                    Components: {
                        [Component.Legs]: { Drawable: 14, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Shoes]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 13, Texture: 0, Palette: 0 },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Shoes]: { Drawable: 2, Texture: 0, Palette: 0 },
                    },
                },
            },
        },
        [PlayerPedHash.Female]: {
            [WardRobeElements.Helmet]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Helmet]: { Clear: true },
                    },
                },
                [MOTO]: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote 1']: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 4, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote 2']: {
                    Props: {
                        [Prop.Helmet]: { Drawable: 15, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Hat]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Hat]: { Clear: true },
                    },
                },
                ['Chapeau']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 2, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 13, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Top]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                [WINTER]: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 0, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                [PILOT]: {
                    Components: {
                        [Component.Torso]: { Drawable: 17, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                    GlovesID: 55000,
                    rankType: MOTO,
                },
                ['Equipement seulement']: {
                    Components: {
                        [Component.Decals]: {
                            Drawable: 4,
                            Texture: 1,
                            Palette: 0,
                            Collection: 'soz_bcso',
                        },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Torso]: { Drawable: 11, Texture: 0, Palette: 0 },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 12, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 19, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 17, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['T-Shirt Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 16, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Motocycle Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Air Support Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 19, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['T-Shirt Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 20, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: TSHIRT,
                },
                ['Polo Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 22, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 21, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 24, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manchon Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 23, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 22, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 24, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 18, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Traffic Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Marine Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 20, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Wildlife Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Training Team']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 26, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Polo manche courte Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 14, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 25, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: POLO,
                },
                ['Blouson Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 14, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson K-9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson Vice Unit']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson Cadets']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Blouson Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 32, Texture: 12, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: BLOUSON,
                },
                ['Chemise blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 27, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 27, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise cravate blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 28, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise cravate noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 28, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Imperméable capuche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 29, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: RAINCOAT,
                },
                ['Imperméable']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 30, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: RAINCOAT,
                },
                ['Hiver']: {
                    Components: {
                        [Component.Torso]: { Drawable: 1, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 31, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: WINTER,
                },
                ['Manteau ouvert Patrol']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert Vice']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert Supervisor']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 4, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Manteau ouvert K9']: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Tops]: { Drawable: 33, Texture: 6, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: COAT,
                },
                ['Chemise courte blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte verte']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 11, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 4, Texture: 13, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate blanche']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate verte']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 8, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                ['Chemise courte cravate noir-doré']: {
                    Components: {
                        [Component.Torso]: { Drawable: 9, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 1, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 34, Texture: 10, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
            },
            [WardRobeElements.Accessory]: {
                ['Aucun']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    },
                },
                ['Holster']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Belt]: {
                ['Aucune']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    },
                },
                ['BCSO']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['LSPD']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Anti-Emeute']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pilote']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Chemise grise ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 39, Texture: 1, Palette: 0 },
                    },
                },
                ['Chemise grise fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 38, Texture: 1, Palette: 0 },
                    },
                },
                ['Pull']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 67, Texture: 0, Palette: 0 },
                    },
                },
                ['Chemise verte fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 216, Texture: 7, Palette: 0 },
                    },
                },
                ['Chemise verte claire fermée']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 216, Texture: 5, Palette: 0 },
                    },
                },
                ['Chemise verte ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 217, Texture: 7, Palette: 0 },
                    },
                },
                ['Chemise verte claire ouverte']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 217, Texture: 5, Palette: 0 },
                    },
                },
            },
            [WardRobeElements.Bottom]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Legs]: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [PILOT]: {
                    Components: {
                        [Component.Legs]: { Drawable: 5, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Legs]: { Drawable: 3, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Legs]: { Drawable: 10, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Cérémonie']: {
                    Components: {
                        [Component.Legs]: { Drawable: 14, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Pantalon vert']: {
                    Components: {
                        [Component.Legs]: { Drawable: 15, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Jupe courte']: {
                    Components: {
                        [Component.Legs]: { Drawable: 17, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Jupe longue']: {
                    Components: {
                        [Component.Legs]: { Drawable: 16, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Shoes]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    },
                },
                [PILOT]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 24, Texture: 0, Palette: 0 },
                    },
                },
                [MOTO]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 34, Texture: 0, Palette: 0 },
                    },
                },
                ['Tenue Sportive']: {
                    Components: {
                        [Component.Shoes]: { Drawable: 10, Texture: 0, Palette: 0 },
                    },
                },
                ['Talons']: {
                    Components: {
                        [Component.Shoes]: { Drawable: 6, Texture: 0, Palette: 0 },
                    },
                },
            },
        },
    },
    [JobType.SASP]: {
        [PlayerPedHash.Male]: {
            [WardRobeElements.Hat]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Hat]: { Clear: true },
                    },
                },
                ['Chapeau']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Chapeau sombre']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Top]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                        [Component.BodyArmor]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 2, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                [SASP_DARK]: {
                    Components: {
                        [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                        [Component.BodyArmor]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 2, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
            },
            [WardRobeElements.Accessory]: {
                ['Aucun']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    },
                },
                ['Holster']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Belt]: {
                ['Aucune']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    },
                },
                ['BCSO']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['LSPD']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Anti-Emeute']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Bottom]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Legs]: { Drawable: 1, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [SASP_DARK]: {
                    Components: {
                        [Component.Legs]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Shoes]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 51, Texture: 0, Palette: 0 },
                    },
                },
            },
        },
        [PlayerPedHash.Female]: {
            [WardRobeElements.Hat]: {
                ['Aucun']: {
                    Props: {
                        [Prop.Hat]: { Clear: true },
                    },
                },
                ['Chapeau']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Chapeau sombre']: {
                    Props: {
                        [Prop.Hat]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Top]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                        [Component.BodyArmor]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 2, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
                [SASP_DARK]: {
                    Components: {
                        [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                        [Component.Bag]: { Drawable: 2, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                        [Component.BodyArmor]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                        [Component.Tops]: { Drawable: 2, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    },
                    rankType: DUTY_OUTFIT_NAME,
                },
            },
            [WardRobeElements.Accessory]: {
                ['Aucun']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    },
                },
                ['Holster']: {
                    Components: {
                        [Component.Accessories]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Belt]: {
                ['Aucune']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    },
                },
                ['BCSO']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['LSPD']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                ['Anti-Emeute']: {
                    Components: {
                        [Component.Undershirt]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Bottom]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Legs]: { Drawable: 1, Texture: 2, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
                [SASP_DARK]: {
                    Components: {
                        [Component.Legs]: { Drawable: 8, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    },
                },
            },
            [WardRobeElements.Shoes]: {
                [DUTY_OUTFIT_NAME]: {
                    Components: {
                        [Component.Shoes]: { Drawable: 52, Texture: 0, Palette: 0 },
                    },
                },
            },
        },
    },
};

export const RankOutfit: Partial<
    Record<JobType, Record<PlayerPedHash, Record<string, Record<number, [number, number]>>>>
> = {
    [JobType.LSPD]: {
        [PlayerPedHash.Male]: {
            [DUTY_OUTFIT_NAME]: {
                [78]: [7, 0], // Officier
                [284]: [7, 1], // Caporal
                [77]: [7, 2], // Sergeant
                [76]: [2, 0], // Second Lieutenant
                [285]: [2, 1], // Premier Lieutenant
                [75]: [2, 2], // Captain
                [74]: [2, 3], // Commander
                [73]: [2, 4], // Deputy Chief
                [30]: [2, 5], // Chief of Police
            },
            [MOTO]: {
                [78]: [7, 0], // Officier
                [284]: [7, 1], // Caporal
                [77]: [7, 2], // Sergeant
                [76]: [9, 0], // Second Lieutenant
                [285]: [9, 1], // Premier Lieutenant
                [75]: [9, 2], // Captain
                [74]: [9, 3], // Commander
                [73]: [9, 4], // Deputy Chief
                [30]: [9, 5], // Chief of Police
            },
            [WINTER]: {
                [78]: [12, 0], // Officier
                [284]: [12, 1], // Caporal
                [77]: [12, 2], // Sergeant
                [76]: [10, 0], // Second Lieutenant
                [285]: [10, 1], // Premier Lieutenant
                [75]: [10, 2], // Captain
                [74]: [10, 3], // Commander
                [73]: [10, 4], // Deputy Chief
                [30]: [10, 5], // Chief of Police
            },
            [TSHIRT]: {
                [78]: [22, 3], // Officier
                [284]: [22, 4], // Caporal
                [77]: [22, 5], // Sergeant
                [76]: [20, 0], // Second Lieutenant
                [285]: [20, 1], // Premier Lieutenant
                [75]: [20, 2], // Captain
                [74]: [20, 3], // Commander
                [73]: [20, 4], // Deputy Chief
                [30]: [20, 5], // Chief of Police
            },
            [POLO]: {
                [78]: [19, 3], // Officier
                [284]: [19, 4], // Caporal
                [77]: [19, 5], // Sergeant
                [76]: [21, 0], // Second Lieutenant
                [285]: [21, 1], // Premier Lieutenant
                [75]: [21, 2], // Captain
                [74]: [21, 3], // Commander
                [73]: [21, 4], // Deputy Chief
                [30]: [21, 5], // Chief of Police
            },
            [PULL]: {
                [78]: [37, 3], // Officier
                [284]: [37, 4], // Caporal
                [77]: [37, 5], // Sergeant
                [76]: [36, 0], // Second Lieutenant
                [285]: [36, 1], // Premier Lieutenant
                [75]: [36, 2], // Captain
                [74]: [36, 3], // Commander
                [73]: [36, 4], // Deputy Chief
                [30]: [36, 5], // Chief of Police
            },
            [BLOUSON]: {
                [78]: [26, 3], // Officier
                [284]: [26, 4], // Caporal
                [77]: [26, 5], // Sergeant
                [76]: [27, 0], // Second Lieutenant
                [285]: [27, 1], // Premier Lieutenant
                [75]: [27, 2], // Captain
                [74]: [27, 3], // Commander
                [73]: [27, 4], // Deputy Chief
                [30]: [27, 5], // Chief of Police
            },
            [RAINCOAT]: {
                [78]: [29, 3], // Officier
                [284]: [29, 4], // Caporal
                [77]: [29, 5], // Sergeant
                [76]: [30, 0], // Second Lieutenant
                [285]: [30, 1], // Premier Lieutenant
                [75]: [30, 2], // Captain
                [74]: [30, 3], // Commander
                [73]: [30, 4], // Deputy Chief
                [30]: [30, 5], // Chief of Police
            },
            [COAT]: {
                [78]: [32, 3], // Officier
                [284]: [32, 4], // Caporal
                [77]: [32, 5], // Sergeant
                [76]: [33, 0], // Second Lieutenant
                [285]: [33, 1], // Premier Lieutenant
                [75]: [33, 2], // Captain
                [74]: [33, 3], // Commander
                [73]: [33, 4], // Deputy Chief
                [30]: [33, 5], // Chief of Police
            },
            [BLOUSON_SANSCOL]: {
                [78]: [17, 3], // Officier
                [284]: [17, 4], // Caporal
                [77]: [17, 5], // Sergeant
                [76]: [38, 0], // Second Lieutenant
                [285]: [38, 1], // Premier Lieutenant
                [75]: [38, 2], // Captain
                [74]: [38, 3], // Commander
                [73]: [38, 4], // Deputy Chief
                [30]: [38, 5], // Chief of Police
            },
        },
        [PlayerPedHash.Female]: {
            [DUTY_OUTFIT_NAME]: {
                [78]: [7, 0], // Officier
                [284]: [7, 1], // Caporal
                [77]: [7, 2], // Sergeant
                [76]: [2, 0], // Second Lieutenant
                [285]: [2, 1], // Premier Lieutenant
                [75]: [2, 2], // Captain
                [74]: [2, 3], // Commander
                [73]: [2, 4], // Deputy Chief
                [30]: [2, 5], // Chief of Police
            },
            [MOTO]: {
                [78]: [7, 0], // Officier
                [284]: [7, 1], // Caporal
                [77]: [7, 2], // Sergeant
                [76]: [9, 0], // Second Lieutenant
                [285]: [9, 1], // Premier Lieutenant
                [75]: [9, 2], // Captain
                [74]: [9, 3], // Commander
                [73]: [9, 4], // Deputy Chief
                [30]: [9, 5], // Chief of Police
            },
            [WINTER]: {
                [78]: [12, 0], // Officier
                [284]: [12, 1], // Caporal
                [77]: [12, 2], // Sergeant
                [76]: [10, 0], // Second Lieutenant
                [285]: [10, 1], // Premier Lieutenant
                [75]: [10, 2], // Captain
                [74]: [10, 3], // Commander
                [73]: [10, 4], // Deputy Chief
                [30]: [10, 5], // Chief of Police
            },
            [TSHIRT]: {
                [78]: [19, 3], // Officier
                [284]: [19, 4], // Caporal
                [77]: [19, 5], // Sergeant
                [76]: [17, 0], // Second Lieutenant
                [285]: [17, 1], // Premier Lieutenant
                [75]: [17, 2], // Captain
                [74]: [17, 3], // Commander
                [73]: [17, 4], // Deputy Chief
                [30]: [17, 5], // Chief of Police
            },
            [POLO]: {
                [78]: [16, 3], // Officier
                [284]: [16, 4], // Caporal
                [77]: [16, 5], // Sergeant
                [76]: [18, 0], // Second Lieutenant
                [285]: [18, 1], // Premier Lieutenant
                [75]: [18, 2], // Captain
                [74]: [18, 3], // Commander
                [73]: [18, 4], // Deputy Chief
                [30]: [18, 5], // Chief of Police
            },
            [BLOUSON]: {
                [78]: [23, 3], // Officier
                [284]: [23, 4], // Caporal
                [77]: [23, 5], // Sergeant
                [76]: [24, 0], // Second Lieutenant
                [285]: [24, 1], // Premier Lieutenant
                [75]: [24, 2], // Captain
                [74]: [24, 3], // Commander
                [73]: [24, 4], // Deputy Chief
                [30]: [24, 5], // Chief of Police
            },
            [RAINCOAT]: {
                [78]: [26, 3], // Officier
                [284]: [26, 4], // Caporal
                [77]: [26, 5], // Sergeant
                [76]: [27, 0], // Second Lieutenant
                [285]: [27, 1], // Premier Lieutenant
                [75]: [27, 2], // Captain
                [74]: [27, 3], // Commander
                [73]: [27, 4], // Deputy Chief
                [30]: [27, 5], // Chief of Police
            },
            [COAT]: {
                [78]: [29, 3], // Officier
                [284]: [29, 4], // Caporal
                [77]: [29, 5], // Sergeant
                [76]: [30, 0], // Second Lieutenant
                [285]: [30, 1], // Premier Lieutenant
                [75]: [30, 2], // Captain
                [74]: [30, 3], // Commander
                [73]: [30, 4], // Deputy Chief
                [30]: [30, 5], // Chief of Police
            },
        },
    },
    [JobType.BCSO]: {
        [PlayerPedHash.Male]: {
            [DUTY_OUTFIT_NAME]: {
                [71]: [0, 0], // Junior
                [70]: [0, 1], // Senior
                [69]: [0, 2], // Major
                [282]: [5, 0], // Second Brigadier
                [68]: [5, 1], // Premier Brigadier
                [283]: [5, 2], // supervisor
                [201]: [5, 3], // Division chief
                [66]: [5, 4], // Undersheriff
                [38]: [5, 5], // Sheriff
            },
            [MOTO]: {
                [71]: [0, 0], // Junior
                [70]: [0, 1], // Senior
                [69]: [0, 2], // Major
                [282]: [8, 0], // Second Brigadier
                [68]: [8, 1], // Premier Brigadier
                [283]: [8, 2], // supervisor
                [201]: [8, 3], // Division chief
                [66]: [8, 4], // Undersheriff
                [38]: [8, 5], // Sheriff
            },
            [WINTER]: {
                [71]: [13, 0], // Junior
                [70]: [13, 1], // Senior
                [69]: [13, 2], // Major
                [282]: [11, 0], // Second Brigadier
                [68]: [11, 1], // Premier Brigadier
                [283]: [11, 2], // supervisor
                [201]: [11, 3], // Division chief
                [66]: [11, 4], // Undersheriff
                [38]: [11, 5], // Sheriff
            },
            [TSHIRT]: {
                [71]: [22, 0], // Junior
                [70]: [22, 1], // Senior
                [69]: [22, 2], // Major
                [282]: [25, 0], // Second Brigadier
                [68]: [25, 1], // Premier Brigadier
                [283]: [25, 2], // supervisor
                [201]: [25, 3], // Division chief
                [66]: [25, 4], // Undersheriff
                [38]: [25, 5], // Sheriff
            },
            [POLO]: {
                [71]: [19, 0], // Junior
                [70]: [19, 1], // Senior
                [69]: [19, 2], // Major
                [282]: [24, 0], // Second Brigadier
                [68]: [24, 1], // Premier Brigadier
                [283]: [24, 2], // supervisor
                [201]: [24, 3], // Division chief
                [66]: [24, 4], // Undersheriff
                [38]: [24, 5], // Sheriff
            },
            [PULL]: {
                [71]: [37, 0], // Junior
                [70]: [37, 1], // Senior
                [69]: [37, 2], // Major
                [282]: [35, 0], // Second Brigadier
                [68]: [35, 1], // Premier Brigadier
                [283]: [35, 2], // supervisor
                [201]: [35, 3], // Division chief
                [66]: [35, 4], // Undersheriff
                [38]: [35, 5], // Sheriff
            },
            [BLOUSON]: {
                [71]: [26, 0], // Junior
                [70]: [26, 1], // Senior
                [69]: [26, 2], // Major
                [282]: [28, 0], // Second Brigadier
                [68]: [28, 1], // Premier Brigadier
                [283]: [28, 2], // supervisor
                [201]: [28, 3], // Division chief
                [66]: [28, 4], // Undersheriff
                [38]: [28, 5], // Sheriff
            },
            [RAINCOAT]: {
                [71]: [29, 0], // Junior
                [70]: [29, 1], // Senior
                [69]: [29, 2], // Major
                [282]: [31, 0], // Second Brigadier
                [68]: [31, 1], // Premier Brigadier
                [283]: [31, 2], // supervisor
                [201]: [31, 3], // Division chief
                [66]: [31, 4], // Undersheriff
                [38]: [31, 5], // Sheriff
            },
            [COAT]: {
                [71]: [32, 0], // Junior
                [70]: [32, 1], // Senior
                [69]: [32, 2], // Major
                [282]: [34, 0], // Second Brigadier
                [68]: [34, 1], // Premier Brigadier
                [283]: [34, 2], // supervisor
                [201]: [34, 3], // Division chief
                [66]: [34, 4], // Undersheriff
                [38]: [34, 5], // Sheriff
            },
            [BLOUSON_SANSCOL]: {
                [71]: [17, 3], // Junior
                [70]: [17, 4], // Senior
                [69]: [17, 5], // Major
                [282]: [39, 0], // Second Brigadier
                [68]: [39, 1], // Premier Brigadier
                [283]: [39, 2], // supervisor
                [201]: [39, 3], // Division chief
                [66]: [39, 4], // Undersheriff
                [38]: [39, 5], // Sheriff
            },
        },
        [PlayerPedHash.Female]: {
            [DUTY_OUTFIT_NAME]: {
                [71]: [0, 0], // Junior
                [70]: [0, 1], // Senior
                [69]: [0, 2], // Major
                [282]: [5, 0], // Second Brigadier
                [68]: [5, 1], // Premier Brigadier
                [283]: [5, 2], // supervisor
                [201]: [5, 3], // Division chief
                [66]: [5, 4], // Undersheriff
                [38]: [5, 5], // Sheriff
            },
            [MOTO]: {
                [71]: [0, 0], // Junior
                [70]: [0, 1], // Senior
                [69]: [0, 2], // Major
                [282]: [8, 0], // Second Brigadier
                [68]: [8, 1], // Premier Brigadier
                [283]: [8, 2], // supervisor
                [201]: [8, 3], // Division chief
                [66]: [8, 4], // Undersheriff
                [38]: [8, 5], // Sheriff
            },
            [WINTER]: {
                [71]: [13, 0], // Junior
                [70]: [13, 1], // Senior
                [69]: [13, 2], // Major
                [282]: [11, 0], // Second Brigadier
                [68]: [11, 1], // Premier Brigadier
                [283]: [11, 2], // supervisor
                [201]: [11, 3], // Division chief
                [66]: [11, 4], // Undersheriff
                [38]: [11, 5], // Sheriff
            },
            [TSHIRT]: {
                [71]: [19, 0], // Junior
                [70]: [19, 1], // Senior
                [69]: [19, 2], // Major
                [282]: [22, 0], // Second Brigadier
                [68]: [22, 1], // Premier Brigadier
                [283]: [22, 2], // supervisor
                [201]: [22, 3], // Division chief
                [66]: [22, 4], // Undersheriff
                [38]: [22, 5], // Sheriff
            },
            [POLO]: {
                [71]: [16, 0], // Junior
                [70]: [16, 1], // Senior
                [69]: [16, 2], // Major
                [282]: [21, 0], // Second Brigadier
                [68]: [21, 1], // Premier Brigadier
                [283]: [21, 2], // supervisor
                [201]: [21, 3], // Division chief
                [66]: [21, 4], // Undersheriff
                [38]: [21, 5], // Sheriff
            },
            [PULL]: {
                [71]: [35, 0], // Junior
                [70]: [35, 1], // Senior
                [69]: [35, 2], // Major
                [282]: [37, 0], // Second Brigadier
                [68]: [37, 1], // Premier Brigadier
                [283]: [37, 2], // supervisor
                [201]: [37, 3], // Division chief
                [66]: [37, 4], // Undersheriff
                [38]: [37, 5], // Sheriff
            },
            [BLOUSON]: {
                [71]: [23, 0], // Junior
                [70]: [23, 1], // Senior
                [69]: [23, 2], // Major
                [282]: [25, 0], // Second Brigadier
                [68]: [25, 1], // Premier Brigadier
                [283]: [25, 2], // supervisor
                [201]: [25, 3], // Division chief
                [66]: [25, 4], // Undersheriff
                [38]: [25, 5], // Sheriff
            },
            [RAINCOAT]: {
                [71]: [26, 0], // Junior
                [70]: [26, 1], // Senior
                [69]: [26, 2], // Major
                [282]: [28, 0], // Second Brigadier
                [68]: [28, 1], // Premier Brigadier
                [283]: [28, 2], // supervisor
                [201]: [28, 3], // Division chief
                [66]: [28, 4], // Undersheriff
                [38]: [28, 5], // Sheriff
            },
            [COAT]: {
                [71]: [29, 0], // Junior
                [70]: [29, 1], // Senior
                [69]: [29, 2], // Major
                [282]: [31, 0], // Second Brigadier
                [68]: [31, 1], // Premier Brigadier
                [283]: [31, 2], // supervisor
                [201]: [31, 3], // Division chief
                [66]: [31, 4], // Undersheriff
                [38]: [31, 5], // Sheriff
            },
        },
    },
    [JobType.SASP]: {
        [PlayerPedHash.Male]: {
            [DUTY_OUTFIT_NAME]: {
                [235]: [6, 0], // Trooper
                [286]: [6, 1], // Corporal Trooper
                [234]: [6, 2], // Sergeant Trooper
                [233]: [6, 3], // Lieutenant Trooper
                [232]: [6, 4], // Assistant Commissioner
                [231]: [6, 5], // Commissioner
            },
            [SASP_DARK]: {
                [235]: [6, 0], // Trooper
                [286]: [6, 1], // Corporal Trooper
                [234]: [6, 2], // Sergeant Trooper
                [233]: [6, 3], // Lieutenant Trooper
                [232]: [6, 4], // Assistant Commissioner
                [231]: [6, 5], // Commissioner
            },
        },
        [PlayerPedHash.Female]: {
            [DUTY_OUTFIT_NAME]: {
                [235]: [6, 0], // Trooper
                [286]: [6, 1], // Corporal Trooper
                [234]: [6, 2], // Sergeant Trooper
                [233]: [6, 3], // Lieutenant Trooper
                [232]: [6, 4], // Assistant Commissioner
                [231]: [6, 5], // Commissioner
            },
            [SASP_DARK]: {
                [235]: [6, 0], // Trooper
                [286]: [6, 1], // Corporal Trooper
                [234]: [6, 2], // Sergeant Trooper
                [233]: [6, 3], // Lieutenant Trooper
                [232]: [6, 4], // Assistant Commissioner
                [231]: [6, 5], // Commissioner
            },
        },
    },
};

export const Armors: Record<PlayerPedHash, Record<string, OutfitItem>> = {
    [PlayerPedHash.Male]: {
        ['unmark']: {
            Drawable: 2,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['lspd']: {
            Drawable: 1,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['bcso']: {
            Drawable: 2,
            Texture: 3,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['lsmc']: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
        ['stonk']: {
            Drawable: 0,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['fbi']: {
            Drawable: 2,
            Texture: 2,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['news']: { Drawable: 27, Texture: 2, Palette: 0 }, // is unmarked, need reskin
        ['you-news']: { Drawable: 27, Texture: 4, Palette: 0 }, // is unmarked, need reskin
        ['sasp1']: {
            Drawable: 9,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['sasp2']: {
            Drawable: 10,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['bulletproof_vest_medium']: {
            Drawable: 7,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['bulletproof_vest_low']: {
            Drawable: 6,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_tactical']: {
            Drawable: 12,
            Texture: 1,
            Palette: 0,
        },
        ['armor_tactical_light']: {
            Drawable: 11, //drawable 75
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_tactical_medium']: {
            Drawable: 12, // drawable 74
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_tactical_heavy']: {
            Drawable: 15,
            Texture: 2,
            Palette: 0,
        },
        ['swat_1']: {
            Drawable: 14,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['swat_2']: {
            Drawable: 15,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['swat_3']: {
            Drawable: 13,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['swat_4']: {
            Drawable: 25,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_lifejacket_lspd']: {
            Drawable: 16,
            Texture: 1,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_securejacket_lspd']: {
            Drawable: 18,
            Texture: 1,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_marinejacket_lspd']: {
            Drawable: 17,
            Texture: 1,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_detentionjacket_lspd']: {
            Drawable: 19,
            Texture: 1,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_lifejacket_bcso']: {
            Drawable: 16,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_securejacket_bcso']: {
            Drawable: 18,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_marinejacket_bcso']: {
            Drawable: 17,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_detentionjacket_bcso']: {
            Drawable: 19,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
    },
    [PlayerPedHash.Female]: {
        ['unmark']: {
            Drawable: 2,
            Texture: 7,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['lspd']: {
            Drawable: 1,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['bcso']: {
            Drawable: 2,
            Texture: 4,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['lsmc']: { Drawable: 1, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
        ['stonk']: {
            Drawable: 0,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['fbi']: {
            Drawable: 2,
            Texture: 2,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['news']: { Drawable: 31, Texture: 2, Palette: 0 }, // is unmarked, need reskin
        ['you-news']: { Drawable: 31, Texture: 4, Palette: 0 }, // is unmarked, need reskin
        ['sasp1']: {
            Drawable: 9,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['sasp2']: {
            Drawable: 11,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['bulletproof_vest_medium']: {
            Drawable: 7,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['bulletproof_vest_low']: {
            Drawable: 6,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_tactical']: {
            Drawable: 7,
            Texture: 1,
            Palette: 0,
        },
        ['armor_tactical_light']: {
            Drawable: 12,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_tactical_medium']: {
            Drawable: 13,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_tactical_heavy']: {
            Drawable: 17,
            Texture: 2,
            Palette: 0,
        },
        ['swat_1']: {
            Drawable: 14,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['swat_2']: {
            Drawable: 15,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['swat_3']: {
            Drawable: 16,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['swat_4']: {
            Drawable: 18,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_lifejacket_lspd']: {
            Drawable: 19,
            Texture: 1,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_securejacket_lspd']: {
            Drawable: 20,
            Texture: 1,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_marinejacket_lspd']: {
            Drawable: 21,
            Texture: 1,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_detentionjacket_lspd']: {
            Drawable: 22,
            Texture: 1,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_lifejacket_bcso']: {
            Drawable: 19,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_securejacket_bcso']: {
            Drawable: 20,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_marinejacket_bcso']: {
            Drawable: 21,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
        ['armor_detentionjacket_bcso']: {
            Drawable: 22,
            Texture: 0,
            Palette: 0,
            Collection: 'soz_bcso',
        },
    },
};

/**
 * Tables for armors minor injuries
 */
export const InjuriesArmorException = ['bulletproof_vest_medium', 'bulletproof_vest_low'];
export const InjuriesReducedOutfit = ['light_intervention_outfit', 'heavy_antiriot_outfit'];

export const MaleLSPDGlovesId = 100_000;
export const FemaleLSPDGlovesId = 100_001;

export const ObjectOutFits: Partial<Record<JobType, WardrobeConfig>> = {
    [JobType.LSPD]: {
        [PlayerPedHash.Male]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Male][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 1,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 150, Texture: 0, Palette: 0 },
                    [Prop.Glasses]: { Drawable: 40, Texture: 0, Palette: 0 },
                },
                GlovesID: MaleLSPDGlovesId,
            },
            ['heavy_antiriot_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 5, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 11, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 125, Texture: 0, Palette: 0 },
                },
                GlovesID: MaleLSPDGlovesId,
            },
        },
        [PlayerPedHash.Female]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.LSPD][PlayerPedHash.Female][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 6, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 1,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 10, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 149, Texture: 0, Palette: 0 },
                    [Prop.Glasses]: { Drawable: 42, Texture: 0, Palette: 0 },
                },
                GlovesID: FemaleLSPDGlovesId,
            },
            ['heavy_antiriot_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 52, Texture: 0, Palette: 0 },
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 7, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 5, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 11, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 124, Texture: 0, Palette: 0 },
                },
                GlovesID: FemaleLSPDGlovesId,
            },
        },
    },
    [JobType.BCSO]: {
        [PlayerPedHash.Male]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Male][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 20, Palette: 0 },
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 6, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 1,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: { Drawable: 15, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 10, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 150, Texture: 1, Palette: 0 },
                    [Prop.Glasses]: { Drawable: 40, Texture: 7, Palette: 0 },
                },
                GlovesID: MaleLSPDGlovesId,
            },
            ['heavy_antiriot_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 52, Texture: 4, Palette: 0 },
                    [Component.Torso]: { Drawable: 4, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 7, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 5, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 11, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 125, Texture: 0, Palette: 0 },
                },
                GlovesID: MaleLSPDGlovesId,
            },
        },
        [PlayerPedHash.Female]: {
            ['outfit']: POLICE_CLOAKROOM[JobType.BCSO][PlayerPedHash.Female][DUTY_OUTFIT_NAME],
            ['light_intervention_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 185, Texture: 20, Palette: 0 },
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 6, Texture: 3, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: {
                        Drawable: 1,
                        Texture: 0,
                        Palette: 0,
                        Collection: 'soz_bcso',
                    },
                    [Component.Undershirt]: { Drawable: 14, Texture: 0, Palette: 0 },
                    [Component.BodyArmor]: { Drawable: 4, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 10, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 149, Texture: 1, Palette: 0 },
                    [Prop.Glasses]: { Drawable: 42, Texture: 7, Palette: 0 },
                },
                GlovesID: FemaleLSPDGlovesId,
            },
            ['heavy_antiriot_outfit']: {
                Components: {
                    [Component.Mask]: { Drawable: 52, Texture: 4, Palette: 0 },
                    [Component.Torso]: { Drawable: 3, Texture: 0, Palette: 0 },
                    [Component.Legs]: { Drawable: 7, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Bag]: { Drawable: 9, Texture: 0, Palette: 0 },
                    [Component.Shoes]: { Drawable: 25, Texture: 0, Palette: 0 },
                    [Component.Accessories]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Undershirt]: { Drawable: 3, Texture: 0, Palette: 0, Collection: 'soz_bcso' },
                    [Component.BodyArmor]: { Drawable: 5, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                    [Component.Decals]: { Drawable: 0, Texture: 0, Palette: 0 },
                    [Component.Tops]: { Drawable: 11, Texture: 1, Palette: 0, Collection: 'soz_bcso' },
                },
                Props: {
                    [Prop.Helmet]: { Drawable: 124, Texture: 0, Palette: 0 },
                },
                GlovesID: FemaleLSPDGlovesId,
            },
        },
    },
};

export type PoliceJobLicencesMenuData = {
    job: JobType;
    playerServerId: number;
    playerLicences: Partial<Record<PlayerLicenceType, number>>;
};

export type PoliceClue = {
    id: string;
    model: number;
    position: Vector4;
    noCollision: boolean;
    invisible: boolean;
    matrix?: number[];
    placeOnGround: boolean;
    type: 'evidence_bullet' | 'evidence_blood' | 'evidence_glass';
    information: string;
    outline: boolean;
    quantity: number;
};

export type PoliceJobMoneycheckerMenuData = {
    job: JobType;
    playerServerId: number;
    amount: number;
};

export type PoliceJobFineMenuData = {
    job: JobType;
    playerServerId: number;
};

export type PoliceJobMenuData = {
    displayRadar: boolean;
    permission: SozRole;
};

export const LicencesWithPoints = {
    [PlayerLicenceType.Car]: true,
    [PlayerLicenceType.Truck]: true,
    [PlayerLicenceType.Moto]: true,
    [PlayerLicenceType.Heli]: true,
    [PlayerLicenceType.Boat]: true,
    [PlayerLicenceType.Weapon]: false,
    [PlayerLicenceType.Fishing]: false,
    [PlayerLicenceType.Hunting]: false,
    [PlayerLicenceType.Rescuer]: false,
};

export const PoliceCanEditLicences = {
    [PlayerLicenceType.Car]: true,
    [PlayerLicenceType.Truck]: true,
    [PlayerLicenceType.Moto]: true,
    [PlayerLicenceType.Heli]: true,
    [PlayerLicenceType.Boat]: true,
    [PlayerLicenceType.Weapon]: true,
    [PlayerLicenceType.Fishing]: true,
    [PlayerLicenceType.Hunting]: true,
    [PlayerLicenceType.Rescuer]: false,
};

export type Fine = {
    id: number;
    label: string;
    category: number;
    price: { min: number; max: number };
};

export const GyroModel = 'hei_prop_wall_alarm_on';
export const VehicleWithSirens = {
    // LSMC
    [joaat('ambulance')]: true,
    [joaat('ambulance2')]: true,
    [joaat('ambcar')]: true,
    [joaat('lguard')]: true,
    [joaat('firetruk')]: true,
    // LSPD
    [joaat('police')]: true,
    [joaat('police2')]: true,
    [joaat('police3')]: true,
    [joaat('police4')]: true,
    [joaat('police5')]: true,
    [joaat('lspd10')]: true,
    [joaat('lspd11')]: true,
    [joaat('lspd12')]: true,
    [joaat('lspd20')]: true,
    [joaat('lspd21')]: true,
    [joaat('lspd30')]: true,
    [joaat('lspd40')]: true,
    [joaat('lspd41')]: true,
    [joaat('lspd50')]: true,
    [joaat('lspd51')]: true,
    [joaat('lspd60')]: true,
    // BCSO
    [joaat('sheriff')]: true,
    [joaat('sheriff2')]: true,
    [joaat('sheriff3')]: true,
    [joaat('sheriff4')]: true,
    [joaat('sheriffb')]: true,
    [joaat('bcso10')]: true,
    [joaat('bcso11')]: true,
    [joaat('bcso12')]: true,
    [joaat('bcso20')]: true,
    [joaat('bcso21')]: true,
    [joaat('bcso30')]: true,
    [joaat('bcso40')]: true,
    [joaat('bcso41')]: true,
    [joaat('bcso50')]: true,
    [joaat('bcso51')]: true,
    [joaat('bcso60')]: true,
    // LSPD + BCSO
    [joaat('pbus')]: true,
    //SASP
    [joaat('sasp1')]: true,
    [joaat('sasp20')]: true,
    [joaat('sasp70')]: true,
    [joaat('sasp71')]: true,
    // FBI
    [joaat('fbi')]: true,
    [joaat('fbi2')]: true,
    [joaat('cogfbi')]: true,
    [joaat('paragonfbi')]: true,
    [joaat('paragonsfbi')]: true,
    [joaat('dodgebana')]: true,
    [joaat('polgauntlet')]: true,
    // policeold
    [joaat('policeold1')]: true,
    [joaat('policeold2')]: true,
    // policenew
    [joaat('polimpaler6')]: true,
    [joaat('poldominator10')]: true,
    [joaat('polimpaler5')]: true,
    [joaat('polgreenwood')]: true,
    [joaat('poldorado')]: true,
};

export const SWAT_CASE_ITEM = 'swat_case';
export const SWAT_ITEM_TYPE = 'SWAT';

export const POLICE_DRONE_NAME = 'police_recon_drone';
export const POLICE_MINESWEEPER_ROBOT_OBJECT = 'soz_eodrobot';

export const GyroOffset = {
    [joaat('elegy')]: 0.04,
    [joaat('panto')]: -0.02,
    [joaat('youga')]: 0.0,
    [joaat('habanero')]: -0.05,
};

export type HackedCam = {
    hash: number;
    date: number;
};

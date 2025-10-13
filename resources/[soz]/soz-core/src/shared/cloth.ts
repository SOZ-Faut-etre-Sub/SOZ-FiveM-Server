import { PlayerPedHash } from '@public/shared/player';

import { Vector4 } from './polyzone/vector';

export enum Component {
    Mask = 1,
    Hair = 2,
    Torso = 3,
    Legs = 4,
    Bag = 5,
    Shoes = 6,
    Accessories = 7,
    Undershirt = 8,
    BodyArmor = 9,
    Decals = 10,
    Tops = 11,
}

export enum Prop {
    Hat = 0,
    Glasses = 1,
    Ear = 2,
    LeftHand = 6,
    RightHand = 7,
    Helmet = 'Helmet',
}

export const ApparelComponentToItem: Record<Component, string | null> = {
    [Component.Mask]: 'apparel_mask',
    [Component.Hair]: null,
    [Component.Torso]: null,
    [Component.Legs]: 'apparel_legs',
    [Component.Bag]: 'apparel_bag',
    [Component.Shoes]: 'apparel_shoes',
    [Component.Accessories]: 'apparel_accessories',
    [Component.Undershirt]: null,
    [Component.BodyArmor]: null,
    [Component.Decals]: null,
    [Component.Tops]: 'apparel_tops',
};

export const ApparelPropToItem: Record<Prop, string | null> = {
    [Prop.Hat]: 'apparel_hat',
    [Prop.Glasses]: 'apparel_glasses',
    [Prop.Ear]: 'apparel_ear',
    [Prop.LeftHand]: 'apparel_lefthand',
    [Prop.RightHand]: 'apparel_righthand',
    [Prop.Helmet]: null,
};

export type OutfitItem = {
    Index?: number;
    Drawable?: number;
    Texture?: number;
    Palette?: number;
    Clear?: boolean;
    Collection?: string;
};

export type GlovesItem = {
    id: number;
    correspondingDrawables: Record<number, number>;
    texture: number;
};

export type OutfitType = 'SPORT' | 'SWAT' | 'MINE' | 'FIRE' | '';

export type Outfit = {
    Components?: Partial<Record<Component, OutfitItem>>;
    Props?: Partial<Record<Prop, OutfitItem>>;
    GlovesID?: number;
    TopID?: number;
    type?: OutfitType;
    category?: string;
    rankType?: string;
};

export type ClothConfig = {
    AdminOutfit?: Outfit;
    BaseClothSet: Outfit;
    NakedClothSet: Outfit;
    JobClothSet: Outfit | null;
    TemporaryClothSet: Outfit | null;
    Config: {
        Naked: boolean;
        ShowHelmet: boolean;
        HideHead: boolean;
        HideMask: boolean;
        HideGlasses: boolean;
        HideEar: boolean;
        HideChain: boolean;
        HideBulletproof: boolean;
        HideTop: boolean;
        HideLeftHand: boolean;
        HideRightHand: boolean;
        HideBag: boolean;
        HidePants: boolean;
        HideShoes: boolean;
        HideGloves: boolean;
    };
};

// A list of outfit indexed by name
export type Wardrobe = Record<string, Outfit>;
export type CustomWardrobe = Partial<Record<WardRobeElements, Record<string, Outfit>>>;

export type WardrobeMenuData = {
    wardrobe: Wardrobe;
    allowNullLabel?: string;
    allowCustom?: boolean;
};

export enum WardRobeElements {
    Helmet = 'helmet',
    Hat = 'hat',
    Mask = 'mask',
    Top = 'top',
    Accessory = 'accessory',
    Belt = 'belt',
    Bottom = 'bottom',
    Shoes = 'shoes',
}

export type WardRobeElementConfig = {
    label: string;
    propId?: Prop[];
    componentId?: Component[];
};

export const WardRobeElementConfigs: Record<WardRobeElements, WardRobeElementConfig> = {
    [WardRobeElements.Helmet]: { label: 'Casque', propId: [Prop.Helmet] },
    [WardRobeElements.Hat]: { label: 'Chapeau', propId: [Prop.Hat] },
    [WardRobeElements.Mask]: { label: 'Masque', componentId: [Component.Mask] },
    [WardRobeElements.Top]: {
        label: 'Haut',
        componentId: [Component.Torso, Component.Bag, Component.BodyArmor, Component.Decals, Component.Tops],
    },
    [WardRobeElements.Accessory]: {
        label: 'Accessoire',
        componentId: [Component.Accessories],
    },
    [WardRobeElements.Belt]: { label: 'Ceinture/Chemise', componentId: [Component.Undershirt] },
    [WardRobeElements.Bottom]: { label: 'Bas', componentId: [Component.Legs] },
    [WardRobeElements.Shoes]: { label: 'Chaussures', componentId: [Component.Shoes] },
};

// A list of wardrobe indexed by model hash
export type WardrobeConfig = Record<PlayerPedHash, Wardrobe>;

export const KeepHairWithMask = {
    base: {
        [0]: true,
        [4]: true,
        [6]: true,
        [11]: true,
        [12]: true,
        [14]: true,
        [15]: true,
        [16]: true,
        [29]: true,
        [30]: true,
        [33]: true,
        [36]: true,
        [38]: true,
        [43]: true,
        [44]: true,
        [45]: true,
        [50]: true,
        [51]: true,
        [73]: true,
        [74]: true,
        [75]: true,
        [90]: true,
        [101]: true,
        [105]: true,
        [107]: true,
        [108]: true,
        [111]: true,
        [116]: true,
        [120]: true,
        [121]: true,
        [124]: true,
        [127]: true,
        [128]: true,
        [133]: true,
        [148]: true,
        [160]: true,
        [161]: true,
        [164]: true,
        [165]: true,
        [166]: true,
        [168]: true,
        [169]: true,
        [175]: true,
        [179]: true,
        [183]: true,
        [186]: true,
        [187]: true,
        [198]: true,
        [199]: true,
        [201]: true,
        [202]: true,
        [204]: true,
        [206]: true,
        [207]: true,
        [209]: true,
        [216]: true,
        [217]: true,
        [218]: true,
        [219]: true,
        [220]: true,
        [230]: true,
        [234]: true,
        [235]: true,
    },
    Male_freemode_valentines: {
        [0]: true,
        [1]: true,
    },
    Male_freemode_business: {
        [0]: true,
        [1]: true,
        [2]: true,
    },
    Male_freemode_mpLTS: {
        [1]: true,
        [2]: true,
    },
    Male_xmas2: {
        [2]: true,
    },
    Male_Heist: {
        [1]: true,
        [3]: true,
        [8]: true,
        [9]: true,
        [10]: true,
        [15]: true,
        [16]: true,
    },
    Male_Apt01: {
        [0]: true,
    },
    mp_m_xmas_03: {
        [0]: true,
        [1]: true,
    },
    mp_m_bikerdlc_01: {
        [0]: true,
    },
    mp_m_importexport_01: {
        [10]: true,
    },
    mp_m_gunrunning_01: {
        [2]: true,
        [4]: true,
        [5]: true,
    },
    mp_m_smuggler_01: {
        [1]: true,
        [6]: true,
        [10]: true,
    },
    mp_m_christmas2017: {
        [0]: true,
        [3]: true,
        [6]: true,
        [7]: true,
    },
    mp_m_battle: {
        [0]: true,
    },
    mp_m_vinewood: {
        [0]: true,
    },
    mp_m_heist3: {
        [0]: true,
        [1]: true,
        [4]: true,
        [5]: true,
        [6]: true,
        [8]: true,
        [9]: true,
        [15]: true,
        [19]: true,
    },
    mp_m_sum: {
        [3]: true,
    },
    mp_m_heist4: {
        [1]: true,
        [2]: true,
    },
    mp_m_sum2: {
        [0]: true,
        [1]: true,
        [3]: true,
        [4]: true,
        [6]: true,
        [8]: true,
        [9]: true,
    },
    mp_m_christmas3: {
        [0]: true,
    },
    mp_m_2023_01: {
        [0]: true,
        [1]: true,
        [2]: true,
        [3]: true,
        [4]: true,
    },
    mp_m_2023_02: {
        [4]: true,
        [8]: true,
        [9]: true,
    },
};

export type PlayerCloakroomItem = {
    id: number;
    name: string;
    cloth: Outfit;
};

export const ScubaOutfit: Record<PlayerPedHash, Outfit> = {
    [PlayerPedHash.Male]: {
        Components: {
            [3]: { Drawable: 4, Texture: 0, Palette: 0 },
            [4]: { Drawable: 94, Texture: 0, Palette: 0 },
            [6]: { Drawable: 67, Texture: 0, Palette: 0 },
            [8]: { Drawable: 151, Texture: 0, Palette: 0 },
            [10]: { Drawable: 0, Texture: 0, Palette: 0 },
            [11]: { Drawable: 243, Texture: 0, Palette: 0 },
        },
        Props: {},
    },
    [PlayerPedHash.Female]: {
        Components: {
            [3]: { Drawable: 5, Texture: 0, Palette: 0 },
            [4]: { Drawable: 97, Texture: 0, Palette: 0 },
            [6]: { Drawable: 70, Texture: 0, Palette: 0 },
            [8]: { Drawable: 187, Texture: 0, Palette: 0 },
            [10]: { Drawable: 0, Texture: 0, Palette: 0 },
            [11]: { Drawable: 251, Texture: 0, Palette: 0 },
        },
        Props: {},
    },
};

export const ClothingFields: {
    label: string;
    componentId?: number;
    propId?: number;
    type: 'comp' | 'prop';
    reset: Record<PlayerPedHash, number>;
    camOffset: Vector4;
    fov: number;
}[] = [
    {
        componentId: 1,
        label: 'Masque',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0, 4, 3.65, 0],
        fov: 10,
    },
    {
        componentId: 2,
        label: 'Coupe de cheveux',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: -1,
            [PlayerPedHash.Female]: -1,
        },
        camOffset: [0, 4, 3.7, 180],
        fov: 10,
    },
    {
        componentId: 3,
        label: 'Torse',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: -1,
            [PlayerPedHash.Female]: -1,
        },
        camOffset: [0, 4, 3.2, 0],
        fov: 20,
    },
    {
        componentId: 4,
        label: 'Jambes',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: -1,
            [PlayerPedHash.Female]: -1,
        },
        camOffset: [0, 4, 2.6, 0],
        fov: 18,
    },
    {
        componentId: 5,
        label: 'Sac',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0, 4, 3.2, 180],
        fov: 20,
    },
    {
        componentId: 6,
        label: 'Chaussures',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: -1,
            [PlayerPedHash.Female]: -1,
        },
        camOffset: [0, 4, 2.2, 0],
        fov: 10,
    },
    {
        componentId: 7,
        label: 'Accessoires',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0, 4, 3.2, 0],
        fov: 15,
    },
    {
        componentId: 8,
        label: 'Undershirt',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: -1,
            [PlayerPedHash.Female]: -1,
        },
        camOffset: [0, 4, 3.2, 0],
        fov: 20,
    },
    {
        componentId: 9,
        label: 'Armure',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0, 4, 3.2, 0],
        fov: 20,
    },
    {
        componentId: 10,
        label: 'Décalques',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0, 4, 3.2, 0],
        fov: 20,
    },
    {
        componentId: 11,
        label: 'Hauts',
        type: 'comp',
        reset: {
            [PlayerPedHash.Male]: 15,
            [PlayerPedHash.Female]: -1,
        },
        camOffset: [0, 4, 3.2, 0],
        fov: 20,
    },
    {
        propId: 0,
        label: 'Chapeau',
        type: 'prop',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0, 4, 3.7, 0],
        fov: 10,
    },
    {
        propId: 1,
        label: 'Lunettes',
        type: 'prop',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0, 4, 3.7, 0],
        fov: 7,
    },
    {
        propId: 2,
        label: 'oreilles',
        type: 'prop',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0, 4, 3.7, 0],
        fov: 7,
    },
    {
        propId: 6,
        label: 'Bras gauche',
        type: 'prop',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [-0.3, 4, 2.9, 0],
        fov: 7,
    },
    {
        propId: 7,
        label: 'Bras droit',
        type: 'prop',
        reset: {
            [PlayerPedHash.Male]: 0,
            [PlayerPedHash.Female]: 0,
        },
        camOffset: [0.3, 4, 2.9, 0],
        fov: 7,
    },
];

export type CollectionInfo = {
    dlc: string[];
    data: Record<number, Record<number, Record<number, number>>>;
    current: ClothCollectionSubMenuState[];
};

export type ClothCollectionSubMenuState = {
    fieldIndex: number;
    dlcIndex: number;
    drawable: number;
    texture: number;
};

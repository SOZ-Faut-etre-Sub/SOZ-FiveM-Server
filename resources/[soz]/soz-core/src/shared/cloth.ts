import { PlayerPedHash } from '@public/shared/player';

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

export type Outfit = {
    Components: Partial<Record<Component, OutfitItem>>;
    Props: Partial<Record<Prop, OutfitItem>>;
    GlovesID?: number;
    TopID?: number;
    type?: 'SPORT' | null;
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

export type WardrobeMenuData = {
    wardrobe: Wardrobe;
    allowNullLabel?: string;
    allowCustom?: string;
};

export const WardRobeElements = {
    [0]: { label: 'Casque', propId: ['Helmet'] },
    [1]: { label: 'Chapeau', propId: [0] },
    [2]: { label: 'Masque', componentId: [1] },
    [3]: { label: 'Haut', componentId: [3, 5, 7, 8, 9, 10, 11] },
    [4]: { label: 'Bas', componentId: [4, 6] },
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
            [11]: { Drawable: 251, Texture: 0, Palette: 0 },
        },
        Props: {},
    },
};

export const ClothingFields: { label: string; index: number; type: 'comp' | 'prop' }[] = [
    {
        index: 1,
        label: 'Masque',
        type: 'comp',
    },
    {
        index: 2,
        label: 'Coupe de cheveux',
        type: 'comp',
    },
    {
        index: 3,
        label: 'Torse',
        type: 'comp',
    },
    {
        index: 4,
        label: 'Jambes',
        type: 'comp',
    },
    {
        index: 5,
        label: 'Sac',
        type: 'comp',
    },
    {
        index: 6,
        label: 'Chaussures',
        type: 'comp',
    },
    {
        index: 7,
        label: 'Accessoires',
        type: 'comp',
    },
    {
        index: 8,
        label: 'Undershirt',
        type: 'comp',
    },
    {
        index: 9,
        label: 'Armure',
        type: 'comp',
    },
    {
        index: 10,
        label: 'Décalques',
        type: 'comp',
    },
    {
        index: 11,
        label: 'Hauts',
        type: 'comp',
    },
    {
        index: 0,
        label: 'Chapeau',
        type: 'prop',
    },
    {
        index: 1,
        label: 'Lunettes',
        type: 'prop',
    },
    {
        index: 2,
        label: 'oreilles',
        type: 'prop',
    },
    {
        index: 6,
        label: 'Bras gauche',
        type: 'prop',
    },
    {
        index: 7,
        label: 'Bras droit',
        type: 'prop',
    },
];

export type CollectionInfo = {
    dlc: string[];
    data: Record<string, Record<number, Record<number, number>>>;
};

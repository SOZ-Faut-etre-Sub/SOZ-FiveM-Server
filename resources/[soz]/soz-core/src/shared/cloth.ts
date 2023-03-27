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
};

export type Outfit = {
    Components: Partial<Record<Component, OutfitItem>>;
    Props: Partial<Record<Prop, OutfitItem>>;
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
    [3]: { label: 'Haut', componentId: [3, 5, 7, 8, 10, 11] },
    [4]: { label: 'Bas', componentId: [4, 6] },
};

// A list of wardrobe indexed by model hash
export type WardrobeConfig = Record<number, Wardrobe>;

export const KeepHairWithMask = {
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
};

export type ClothSet = {
    Components: {
        [key in ComponentIndex]?: ClothComponent;
    };
    Props: {
        [key in PropIndex]?: ClothProp;
    };
};

export enum ComponentIndex {
    Mask = 1,
    Hair = 2,
    Torso = 3,
    Legs = 4,
    Bags = 5,
    Shoes = 6,
    Accessories = 7,
    Undershirt = 8,
    BodyArmor = 9,
    Decals = 10,
    Tops = 11,
}

export type ClothComponent = {
    Index?: number;
    Drawable: number;
    Texture: number;
    Palette: number;
};

export enum PropIndex {
    Hats = 0,
    Glasses = 1,
    EarPieces = 2,
    Watches = 6,
    Bracelets = 7,
}

export type ClothProp = {
    Index?: number;
    Drawable: number;
    Texture: number;
    Attached?: boolean;
};

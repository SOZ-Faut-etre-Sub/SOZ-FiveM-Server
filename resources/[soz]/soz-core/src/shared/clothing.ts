export type ClothConfig = {
    components: {
        [key in ComponentIndex]?: ClothComponent;
    };
    props: {
        [key in PropIndex]?: ClothProp;
    };
};

export enum ComponentIndex {
    Head = 0,
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
    drawableId: number;
    textureId: number;
    paletteId: number;
};

export enum PropIndex {
    Hats = 0,
    Glasses = 1,
    EarPieces = 2,
    Watches = 6,
    Bracelets = 7,
}

export type ClothProp = {
    drawableId: number;
    textureId: number;
    attach?: boolean;
};

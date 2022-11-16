export type RGBColor = [number, number, number];

export enum WeaponTintColor {
    Normal = 0,
    Green = 1,
    Gold = 2,
    Pink = 3,
    Army = 4,
    LSPD = 5,
    Orange = 6,
    Platinum = 7,
}
export enum WeaponMk2TintColor {
    Normal = 0,
    Green = 1,
    Gold = 2,
    Pink = 3,
    Army = 4,
    LSPD = 5,
    Orange = 6,
    Platinum = 7,
}

export type WeaponTintColorChoiceItem = {
    label: string;
    color: RGBColor;
};

export const WeaponTintColorChoices: Record<WeaponTintColor, WeaponTintColorChoiceItem> = {
    [WeaponTintColor.Normal]: {
        label: 'Normal',
        color: [0, 0, 0],
    },
    [WeaponTintColor.Green]: {
        label: 'Vert',
        color: [0, 255, 0],
    },
    [WeaponTintColor.Gold]: {
        label: 'Or',
        color: [255, 215, 0],
    },
    [WeaponTintColor.Pink]: {
        label: 'Rose',
        color: [255, 192, 203],
    },
    [WeaponTintColor.Army]: {
        label: 'Armée',
        color: [139, 69, 19],
    },
    [WeaponTintColor.LSPD]: {
        label: 'LSPD',
        color: [0, 0, 255],
    },
    [WeaponTintColor.Orange]: {
        label: 'Orange',
        color: [255, 165, 0],
    },
    [WeaponTintColor.Platinum]: {
        label: 'Platine',
        color: [224, 255, 255],
    },
};

export enum WeaponMk2TintColor {
    ClassicBlack = 0,
    ClassicGray = 1,
    ClassicTwoTone = 2,
    ClassicWhite = 3,
    ClassicBeige = 4,
    ClassicGreen = 5,
    ClassicBlue = 6,
    ClassicEarth = 7,
    ClassicBrownAndBlack = 8,
    RedContrast = 9,
    BlueContrast = 10,
    YellowContrast = 11,
    OrangeContrast = 12,
    BoldPink = 13,
    BoldPurpleAndYellow = 14,
    BoldOrange = 15,
    BoldGreenAndPurple = 16,
    BoldRedFeatures = 17,
    BoldGreenFeatures = 18,
    BoldCyanFeatures = 19,
    BoldYellowFeatures = 20,
    BoldRedAndWhite = 21,
    BoldBlueAndWhite = 22,
    MetallicGold = 23,
    MetallicPlatinum = 24,
    MetallicGrayAndLilac = 25,
    MetallicPurpleAndLime = 26,
    MetallicRed = 27,
    MetallicGreen = 28,
    MetallicBlue = 29,
    MetallicWhiteAndAqua = 30,
    MetallicOrangeAndYellow = 31,
    MetallicRedAndYellow = 32,
}

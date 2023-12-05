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
        color: [32, 107, 46],
    },
    [WeaponTintColor.Gold]: {
        label: 'Or',
        color: [202, 232, 35],
    },
    [WeaponTintColor.Pink]: {
        label: 'Rose',
        color: [149, 83, 163],
    },
    [WeaponTintColor.Army]: {
        label: 'Armée',
        color: [176, 136, 79],
    },
    [WeaponTintColor.LSPD]: {
        label: 'LSPD',
        color: [35, 58, 168],
    },
    [WeaponTintColor.Orange]: {
        label: 'Orange',
        color: [143, 85, 27],
    },
    [WeaponTintColor.Platinum]: {
        label: 'Platine',
        color: [152, 202, 227],
    },
};

export const WeaponMk2TintColorChoices: Record<WeaponMk2TintColor, WeaponTintColorChoiceItem> = {
    [WeaponMk2TintColor.ClassicBlack]: {
        label: 'Noir classique',
        color: [0, 0, 0],
    },
    [WeaponMk2TintColor.ClassicGray]: {
        label: 'Gris classique',
        color: [128, 128, 128],
    },
    [WeaponMk2TintColor.ClassicTwoTone]: {
        label: 'Deux tons classique',
        color: [128, 128, 128],
    },
    [WeaponMk2TintColor.ClassicWhite]: {
        label: 'Blanc classique',
        color: [255, 255, 255],
    },
    [WeaponMk2TintColor.ClassicBeige]: {
        label: 'Beige classique',
        color: [255, 255, 255],
    },
    [WeaponMk2TintColor.ClassicGreen]: {
        label: 'Vert classique',
        color: [0, 255, 0],
    },
    [WeaponMk2TintColor.ClassicBlue]: {
        label: 'Bleu classique',
        color: [0, 0, 255],
    },
    [WeaponMk2TintColor.ClassicEarth]: {
        label: 'Terre classique',
        color: [128, 128, 0],
    },
    [WeaponMk2TintColor.ClassicBrownAndBlack]: {
        label: 'Marron et noir classique',
        color: [128, 128, 0],
    },
    [WeaponMk2TintColor.RedContrast]: {
        label: 'Contraste rouge',
        color: [255, 0, 0],
    },
    [WeaponMk2TintColor.BlueContrast]: {
        label: 'Contraste bleu',
        color: [0, 0, 255],
    },
    [WeaponMk2TintColor.YellowContrast]: {
        label: 'Contraste jaune',
        color: [255, 255, 0],
    },
    [WeaponMk2TintColor.OrangeContrast]: {
        label: 'Contraste orange',
        color: [255, 128, 0],
    },
    [WeaponMk2TintColor.BoldPink]: {
        label: 'Rose audacieux',
        color: [255, 0, 255],
    },
    [WeaponMk2TintColor.BoldPurpleAndYellow]: {
        label: 'Violet et jaune audacieux',
        color: [255, 0, 255],
    },
    [WeaponMk2TintColor.BoldOrange]: {
        label: 'Orange audacieux',
        color: [255, 128, 0],
    },
    [WeaponMk2TintColor.BoldGreenAndPurple]: {
        label: 'Vert et violet audacieux',
        color: [0, 255, 0],
    },
    [WeaponMk2TintColor.BoldRedFeatures]: {
        label: 'Caractéristiques rouges audacieuses',
        color: [255, 0, 0],
    },
    [WeaponMk2TintColor.BoldGreenFeatures]: {
        label: 'Vert audacieux',
        color: [0, 255, 0],
    },
    [WeaponMk2TintColor.BoldCyanFeatures]: {
        label: 'Cyan audacieux',
        color: [0, 255, 255],
    },
    [WeaponMk2TintColor.BoldYellowFeatures]: {
        label: 'Jaune audacieux',
        color: [255, 255, 0],
    },
    [WeaponMk2TintColor.BoldRedAndWhite]: {
        label: 'Rouge et blanc audacieux',
        color: [255, 0, 0],
    },
    [WeaponMk2TintColor.BoldBlueAndWhite]: {
        label: 'Bleu et blanc audacieux',
        color: [0, 0, 255],
    },
    [WeaponMk2TintColor.MetallicGold]: {
        label: 'Or métallique',
        color: [255, 255, 0],
    },
    [WeaponMk2TintColor.MetallicPlatinum]: {
        label: 'Platine métallique',
        color: [152, 202, 227],
    },
    [WeaponMk2TintColor.MetallicGrayAndLilac]: {
        label: 'Gris et lilas métallique',
        color: [128, 128, 128],
    },
    [WeaponMk2TintColor.MetallicPurpleAndLime]: {
        label: 'Violet et vert métallique',
        color: [255, 0, 255],
    },
    [WeaponMk2TintColor.MetallicRed]: {
        label: 'Rouge métallique',
        color: [255, 0, 0],
    },
    [WeaponMk2TintColor.MetallicGreen]: {
        label: 'Vert métallique',
        color: [0, 255, 0],
    },
    [WeaponMk2TintColor.MetallicBlue]: {
        label: 'Bleu métallique',
        color: [0, 0, 255],
    },
    [WeaponMk2TintColor.MetallicWhiteAndAqua]: {
        label: 'Blanc et aqua métallique',
        color: [255, 255, 255],
    },
    [WeaponMk2TintColor.MetallicOrangeAndYellow]: {
        label: 'Orange et jaune métallique',
        color: [255, 128, 0],
    },
    [WeaponMk2TintColor.MetallicRedAndYellow]: {
        label: 'Rouge et jaune métallique',
        color: [255, 128, 0],
    },
};

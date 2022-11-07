import { RGBColor } from '../color';

export enum VehiclePaintType {
    Normal,
    Metallic,
    Pearl,
    Matte,
    Metal,
    Chrome,
}

export enum VehicleColor {
    MetallicBlack,
    MetallicGraphiteBlack,
    MetallicBlackSteel,
    MetallicDarkSilver,
    MetallicSilver,
    MetallicBlueSilver,
    MetallicSteelGray,
    MetallicShadowSilver,
    MetallicStoneSilver,
    MetallicMidnightSilver,
    MetallicGunMetal,
    MetallicAnthraciteGray,
    MatteBlack,
    MatteGray,
    MatteLightGray,
    UtilBlack,
    UtilBlackPoly,
    UtilDarksilver,
    UtilSilver,
    UtilGunMetal,
    UtilShadowSilver,
    WornBlack,
    WornGraphite,
    WornSilverGray,
    WornSilver,
    WornBlueSilver,
    WornShadowSilver,
    MetallicRed,
    MetallicTorinoRed,
    MetallicFormulaRed,
    MetallicBlazeRed,
    MetallicGracefulRed,
    MetallicGarnetRed,
    MetallicDesertRed,
    MetallicCabernetRed,
    MetallicCandyRed,
    MetallicSunriseOrange,
    MetallicClassicGold,
    MetallicOrange,
    MatteRed,
    MatteDarkRed,
    MatteOrange,
    MatteYellow,
    UtilRed,
    UtilBrightRed,
    UtilGarnetRed,
    WornRed,
    WornGoldenRed,
    WornDarkRed,
    MetallicDarkGreen,
    MetallicRacingGreen,
    MetallicSeaGreen,
    MetallicOliveGreen,
    MetallicGreen,
    MetallicGasolineBlueGreen,
    MatteLimeGreen,
    UtilDarkGreen,
    UtilGreen,
    WornDarkGreen,
    WornGreen,
    WornSeaWash,
    MetallicMidnightBlue,
    MetallicDarkBlue,
    MetallicSaxonyBlue,
    MetallicBlue,
    MetallicMarinerBlue,
    MetallicHarborBlue,
    MetallicDiamondBlue,
    MetallicSurfBlue,
    MetallicNauticalBlue,
    MetallicBrightBlue,
    MetallicPurpleBlue,
    MetallicSpinnakerBlue,
    MetallicUltraBlue,
    UtilDarkBlue = 75,
    UtilMidnightBlue,
    UtilBlue,
    UtilSeaFoamBlue,
    UtilLightningBlue,
    UtilMauiBluePoly,
    UtilBrightBlue,
    MatteDarkBlue,
    MatteBlue,
    MatteMidnightBlue,
    WornDarkBlue,
    WornBlue,
    WornLightBlue,
    MetallicTaxiYellow,
    MetallicRaceYellow,
    MetallicBronze,
    MetallicYellowBird,
    MetallicLime,
    MetallicChampagne,
    MetallicPuebloBeige,
    MetallicDarkIvory,
    MetallicChocoBrown,
    MetallicGoldenBrown,
    MetallicLightBrown,
    MetallicStrawBeige,
    MetallicMossBrown,
    MetallicBistonBrown,
    MetallicBeechwood,
    MetallicDarkBeechwood,
    MetallicChocoOrange,
    MetallicBeachSand,
    MetallicSunBleechedSand,
    MetallicCream,
    UtilBrown,
    UtilMediumBrown,
    UtilLightBrown,
    MetallicWhite,
    MetallicFrostWhite,
    WornHoneyBeige,
    WornBrown,
    WornDarkBrown,
    WornStrawBeige,
    BrushedSteel,
    BrushedBlackSteel,
    BrushedAluminium,
    Chrome,
    WornOffWhite,
    UtilOffWhite,
    WornOrange,
    WornLightOrange,
    MetallicSecuricorGreen,
    WornTaxiYellow,
    PoliceCarBlue,
    MatteGreen,
    MatteBrown,
    MatteWhite = 131,
    WornWhite,
    WornOliveArmyGreen,
    PureWhite,
    HotPink,
    SalmonPink,
    MetallicVermillionPink,
    Orange,
    Green,
    Blue,
    MetallicBlackBlue,
    MetallicBlackPurple,
    MetallicBlackRed,
    HunterGreen,
    MetallicPurple,
    MetallicVDarkBlue,
    ModShopBlack1,
    MattePurple,
    MatteDarkPurple,
    MetallicLavaRed,
    MatteForestGreen,
    MatteOliveDrab,
    MatteDesertBrown,
    MatteDesertTan,
    MatteFoliageGreen,
    DefaultAlloyColor,
    EpsilonBlue,
    PureGold,
    BrushedGold,
}

export enum VehicleXenonColor {
    Default = 255,
    White = 0,
    Blue = 1,
    ElectricBlue = 2,
    MintGreen = 3,
    LimeGreen = 4,
    Yellow = 5,
    GoldenShower = 6,
    Orange = 7,
    Red = 8,
    PonyPink = 9,
    HotPink = 10,
    Purple = 11,
    Blacklight = 12,
}

export type VehicleBodyColor = {
    primary: VehicleColor | RGBColor;
    secondary: VehicleColor | RGBColor;
    pearlescent: VehicleColor | null;
    rim: VehicleColor | null;
};

export type WheelMod = {
    value: number;
    custom: boolean;
};

export enum VehicleLicensePlateStyle {
    BlueOnWhite2 = 0,
    YellowOnBlack = 1,
    YellowOnBlue = 2,
    BlueOnWhite1 = 3,
    BlueOnWhite3 = 4,
    NorthYankton = 5,
}

export enum VehicleLicensePlateType {
    FrontAndRearPlates,
    FrontPlate,
    RearPlate,
    None,
}

export enum VehicleNeonLight {
    Left,
    Right,
    Front,
    Back,
}

export enum VehicleWindowTint {
    None,
    PureBlack,
    DarkSmoke,
    LightSmoke,
    Stock,
    Limo,
    Green,
}

export enum VehicleWheelType {
    Sport,
    Muscle,
    Lowrider,
    SUV,
    Offroad,
    Tuner,
    BikeWheels,
    HighEnd,
    BennysOriginals,
    BennysBespoke,
}

export type VehicleNeon = {
    color: RGBColor;
    light: Record<VehicleNeonLight, boolean>;
};

export type VehicleModification = {
    spoiler?: number;
    bumperFront?: number;
    bumperRear?: number;
    sideSkirt?: number;
    exhaust?: number;
    frame?: number;
    grille?: number;
    hood?: number;
    fender?: number;
    fenderRight?: number;
    roof?: number;
    engine?: number;
    brakes?: number;
    transmission?: number;
    horn?: number;
    suspension?: number;
    armor?: number;
    turbo?: boolean;
    tyreSmoke?: boolean;
    xenonHeadlights?: boolean;
    wheelFront?: number;
    wheelRear?: number;
    plateHolder?: number;
    vanityPlate?: string;
    trimDesign?: number;
    ornament?: number;
    dashboard?: number;
    dialDesign?: number;
    doorSpeaker?: number;
    seat?: number;
    steeringWheel?: number;
    columnShifterLevers?: number;
    plaques?: number;
    speakers?: number;
    trunk?: number;
    hydraulics?: number;
    engineBlock?: number;
    airFilter?: number;
    struts?: number;
    archCover?: number;
    aerials?: number;
    trim?: number;
    tank?: number;
    windows?: number;
};

export type VehicleConfiguration = {
    color?: VehicleBodyColor;
    dashboardColor?: VehicleColor;
    interiorColor?: VehicleColor;
    liveryRoof?: number;
    neon?: VehicleNeon;
    plateStyle?: number;
    tyreSmokeColor?: RGBColor;
    wheelType?: VehicleWheelType;
    windowTint?: VehicleWindowTint;
    xenonColor?: VehicleXenonColor;
    livery?: number;
    // extras: Record<number, boolean>; // Temporary disables
    customWheelFront?: boolean;
    customWheelRear?: boolean;
    modification: VehicleModification;
};

export enum VehicleModType {
    Spoiler = 0,
    BumperFront = 1,
    BumperRear = 2,
    SideSkirt = 3,
    Exhaust = 4,
    Frame = 5,
    Grille = 6,
    Hood = 7,
    Fender = 8,
    FenderRight = 9,
    Roof = 10,
    Engine = 11,
    Brakes = 12,
    Transmission = 13,
    Horn = 14,
    Suspension = 15,
    Armor = 16,
    // Nitrous = 17,
    Turbo = 18,
    // Subwoofer = 19,
    TyreSmoke = 20,
    // Hydraulics = 21,
    XenonHeadlights = 22,
    WheelFront = 23,
    WheelRear = 24,
    PlateHolder = 25,
    VanityPlate = 26,
    TrimDesign = 27,
    Ornament = 28,
    Dashboard = 29,
    DialDesign = 30,
    DoorSpeaker = 31,
    Seat = 32,
    SteeringWheel = 33,
    ColumnShifterLevers = 34,
    Plaques = 35,
    Speakers = 36,
    Trunk = 37,
    Hydraulics = 38,
    EngineBlock = 39,
    AirFilter = 40,
    Struts = 41,
    ArchCover = 42,
    Aerials = 43,
    Trim = 44,
    Tank = 45,
    Windows = 46,
    // WindowsSecondary = 47,
    Livery = 48,
    // Lightbar = 49,
}

export type VehicleLsCustomLevel = {
    price: number;
    name: string;
};

export type VehicleLsCustomCategory = {
    label: string;
    levels: VehicleLsCustomLevel[];
};

export type VehicleLsCustom = Partial<Record<keyof VehicleConfiguration, VehicleLsCustomCategory>>;

type VehicleLsCustomBaseConfigItem = {
    priceByLevels: number[];
    type: 'list' | 'toggle';
};

export type VehicleUpgradeChoiceItem = {
    label: string;
    value: number | null;
};

export enum VehicleColorCategory {
    Classic = 'classic',
    Metallic = 'metallic',
    Pearly = 'pearly',
    Matte = 'matte',
    Metal = 'metal',
}

export type VehicleColorChoiceItem = {
    label: string;
    color: RGBColor;
    category?: VehicleColorCategory;
};

export type VehicleUpgradeChoiceList = {
    items: VehicleUpgradeChoiceItem[];
    type: 'list';
};

export type VehicleUpgradeChoiceToggle = {
    type: 'toggle';
};

export type VehicleUpgradeChoice = VehicleUpgradeChoiceList | VehicleUpgradeChoiceToggle;

export type VehicleUpgradeOption<T> = {
    label: string;
    choice: T;
};

export type VehicleUpgradeOptions = {
    livery?: VehicleUpgradeChoiceList;
    liveryRoof?: VehicleUpgradeChoiceList;
    wheelType: Partial<Record<VehicleWheelType, string>>;
    modification: Partial<Record<keyof VehicleModification, VehicleUpgradeOption<VehicleUpgradeChoice>>>;
};

export const VehicleColorChoices: Record<VehicleColor, VehicleColorChoiceItem> = {
    [VehicleColor.MetallicBlack]: {
        label: 'Metallic Black',
        color: [13, 17, 22],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicGraphiteBlack]: {
        label: 'Metallic Graphite Black',
        color: [28, 29, 33],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBlackSteel]: {
        label: 'Metallic Black Steel',
        color: [50, 56, 61],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicDarkSilver]: {
        label: 'Metallic Dark Silver',
        color: [69, 75, 79],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicSilver]: {
        label: 'Metallic Silver',
        color: [153, 157, 160],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBlueSilver]: {
        label: 'Metallic Blue Silver',
        color: [194, 196, 198],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicSteelGray]: {
        label: 'Metallic Steel Gray',
        color: [151, 154, 151],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicShadowSilver]: {
        label: 'Metallic Shadow Silver',
        color: [99, 115, 128],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicStoneSilver]: {
        label: 'Metallic Stone Silver',
        color: [99, 98, 92],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicMidnightSilver]: {
        label: 'Metallic Midnight Silver',
        color: [60, 63, 71],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicGunMetal]: {
        label: 'Metallic Gun Metal',
        color: [68, 78, 84],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicAnthraciteGray]: {
        label: 'Metallic Anthracite Gray',
        color: [29, 33, 41],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MatteBlack]: {
        label: 'Matte Black',
        color: [19, 24, 31],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteGray]: {
        label: 'Matte Gray',
        color: [38, 40, 42],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteLightGray]: {
        label: 'Matte Light Gray',
        color: [81, 85, 84],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.UtilBlack]: {
        label: 'Util Black',
        color: [21, 25, 33],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilBlackPoly]: {
        label: 'Util Black Poly',
        color: [30, 36, 41],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilDarksilver]: {
        label: 'Util Darksilver',
        color: [51, 58, 60],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilSilver]: {
        label: 'Util Silver',
        color: [140, 144, 149],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilGunMetal]: {
        label: 'Util Gun Metal',
        color: [57, 67, 77],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilShadowSilver]: {
        label: 'Util Shadow Silver',
        color: [80, 98, 114],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.WornBlack]: {
        label: 'Worn Black',
        color: [30, 35, 47],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornGraphite]: {
        label: 'Worn Graphite',
        color: [54, 58, 63],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornSilverGray]: {
        label: 'Worn Silver Gray',
        color: [160, 161, 153],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornSilver]: {
        label: 'Worn Silver',
        color: [211, 211, 211],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornBlueSilver]: {
        label: 'Worn Blue Silver',
        color: [183, 191, 202],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornShadowSilver]: {
        label: 'Worn Shadow Silver',
        color: [119, 135, 148],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.MetallicOrange]: {
        label: 'Metallic Orange',
        color: [255, 128, 0],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicRed]: {
        label: 'Metallic Red',
        color: [192, 14, 26],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicTorinoRed]: {
        label: 'Metallic Torino Red',
        color: [218, 25, 24],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicFormulaRed]: {
        label: 'Metallic Formula Red',
        color: [182, 17, 27],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBlazeRed]: {
        label: 'Metallic Blaze Red',
        color: [165, 30, 35],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicGracefulRed]: {
        label: 'Metallic Graceful Red',
        color: [123, 26, 34],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicGarnetRed]: {
        label: 'Metallic Garnet Red',
        color: [142, 27, 31],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicDesertRed]: {
        label: 'Metallic Desert Red',
        color: [111, 24, 24],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicCabernetRed]: {
        label: 'Metallic Cabernet Red',
        color: [73, 17, 29],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicCandyRed]: {
        label: 'Metallic Candy Red',
        color: [182, 15, 37],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicSunriseOrange]: {
        label: 'Metallic Sunrise Orange',
        color: [212, 74, 23],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicClassicGold]: {
        label: 'Metallic Classic Gold',
        color: [194, 148, 79],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MatteRed]: {
        label: 'Matte Red',
        color: [207, 31, 33],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteDarkRed]: {
        label: 'Matte Dark Red',
        color: [115, 32, 33],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteOrange]: {
        label: 'Matte Orange',
        color: [242, 125, 32],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteYellow]: {
        label: 'Matte Yellow',
        color: [255, 201, 31],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.UtilRed]: {
        label: 'Util Red',
        color: [156, 16, 22],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilBrightRed]: {
        label: 'Util Bright Red',
        color: [222, 15, 24],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilGarnetRed]: {
        label: 'Util Garnet Red',
        color: [143, 30, 23],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.WornRed]: {
        label: 'Worn Red',
        color: [169, 71, 68],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornGoldenRed]: {
        label: 'Worn Golden Red',
        color: [177, 108, 81],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornDarkRed]: {
        label: 'Worn Dark Red',
        color: [55, 28, 37],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.MetallicDarkGreen]: {
        label: 'Metallic Dark Green',
        color: [19, 36, 40],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicRacingGreen]: {
        label: 'Metallic Racing Green',
        color: [18, 46, 43],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicSeaGreen]: {
        label: 'Metallic Sea Green',
        color: [18, 56, 60],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicOliveGreen]: {
        label: 'Metallic Olive Green',
        color: [49, 66, 63],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicGreen]: {
        label: 'Metallic Green',
        color: [21, 92, 45],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicGasolineBlueGreen]: {
        label: 'Metallic Gasoline Blue Green',
        color: [27, 103, 112],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MatteLimeGreen]: {
        label: 'Matte Lime Green',
        color: [102, 184, 31],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.UtilDarkGreen]: {
        label: 'Util Dark Green',
        color: [34, 56, 62],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilGreen]: {
        label: 'Util Green',
        color: [29, 90, 63],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.WornDarkGreen]: {
        label: 'Worn Dark Green',
        color: [45, 66, 63],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornGreen]: {
        label: 'Worn Green',
        color: [69, 89, 75],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornSeaWash]: {
        label: 'Worn Sea Wash',
        color: [101, 134, 127],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.MetallicMidnightBlue]: {
        label: 'Metallic Midnight Blue',
        color: [34, 46, 70],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicDarkBlue]: {
        label: 'Metallic Dark Blue',
        color: [35, 49, 85],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicSaxonyBlue]: {
        label: 'Metallic Saxony Blue',
        color: [48, 76, 126],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBlue]: {
        label: 'Metallic Blue',
        color: [71, 87, 143],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicMarinerBlue]: {
        label: 'Metallic Mariner Blue',
        color: [99, 123, 167],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicHarborBlue]: {
        label: 'Metallic Harbor Blue',
        color: [57, 71, 98],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicDiamondBlue]: {
        label: 'Metallic Diamond Blue',
        color: [214, 231, 241],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicSurfBlue]: {
        label: 'Metallic Surf Blue',
        color: [118, 175, 190],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicNauticalBlue]: {
        label: 'Metallic Nautical Blue',
        color: [52, 94, 114],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBrightBlue]: {
        label: 'Metallic Bright Blue',
        color: [11, 156, 241],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicPurpleBlue]: {
        label: 'Metallic Purple Blue',
        color: [47, 45, 82],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicSpinnakerBlue]: {
        label: 'Metallic Spinnaker Blue',
        color: [40, 44, 77],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicUltraBlue]: {
        label: 'Metallic Ultra Blue',
        color: [35, 84, 161],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.UtilDarkBlue]: {
        label: 'Util Dark Blue',
        color: [17, 37, 82],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilMidnightBlue]: {
        label: 'Util Midnight Blue',
        color: [27, 32, 62],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilBlue]: {
        label: 'Util Blue',
        color: [39, 81, 144],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilSeaFoamBlue]: {
        label: 'Util Sea Foam Blue',
        color: [96, 133, 146],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilLightningBlue]: {
        label: 'Uil Lightning Blue',
        color: [36, 70, 168],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilMauiBluePoly]: {
        label: 'Util Maui Blue Poly',
        color: [66, 113, 225],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilBrightBlue]: {
        label: 'Util Bright Blue',
        color: [59, 57, 224],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.MatteDarkBlue]: {
        label: 'Matte Dark Blue',
        color: [31, 40, 82],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteBlue]: {
        label: 'Matte Blue',
        color: [37, 58, 167],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteMidnightBlue]: {
        label: 'Matte Midnight Blue',
        color: [28, 53, 81],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.WornDarkBlue]: {
        label: 'Worn Dark Blue',
        color: [76, 95, 129],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornBlue]: {
        label: 'Worn Blue',
        color: [88, 104, 142],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornLightBlue]: {
        label: 'Worn Light Blue',
        color: [116, 181, 216],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.MetallicTaxiYellow]: {
        label: 'Metallic Taxi Yellow',
        color: [255, 207, 32],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicRaceYellow]: {
        label: 'Metallic Race Yellow',
        color: [251, 226, 18],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBronze]: {
        label: 'Metallic Bronze',
        color: [145, 101, 50],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicYellowBird]: {
        label: 'Metallic Yellow Bird',
        color: [224, 225, 61],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicLime]: {
        label: 'Metallic Lime',
        color: [152, 210, 35],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicChampagne]: {
        label: 'Metallic Champagne',
        color: [155, 140, 120],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicPuebloBeige]: {
        label: 'Metallic Pueblo Beige',
        color: [80, 50, 24],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicDarkIvory]: {
        label: 'Metallic Dark Ivory',
        color: [71, 63, 43],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicChocoBrown]: {
        label: 'Metallic Choco Brown',
        color: [34, 27, 25],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicGoldenBrown]: {
        label: 'Metallic Golden Brown',
        color: [101, 63, 35],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicLightBrown]: {
        label: 'Metallic Light Brown',
        color: [119, 92, 62],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicStrawBeige]: {
        label: 'Metallic Straw Beige',
        color: [172, 153, 117],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicMossBrown]: {
        label: 'Metallic Moss Brown',
        color: [108, 107, 75],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBistonBrown]: {
        label: 'Metallic Biston Brown',
        color: [64, 46, 43],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBeechwood]: {
        label: 'Metallic Beechwood',
        color: [164, 150, 95],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicDarkBeechwood]: {
        label: 'Metallic Dark Beechwood',
        color: [70, 35, 26],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicChocoOrange]: {
        label: 'Metallic Choco Orange',
        color: [117, 43, 25],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBeachSand]: {
        label: 'Metallic Beach Sand',
        color: [191, 174, 123],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicSunBleechedSand]: {
        label: 'Metallic Sun Bleeched Sand',
        color: [223, 213, 178],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicCream]: {
        label: 'Metallic Cream',
        color: [247, 237, 213],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.UtilBrown]: {
        label: 'Util Brown',
        color: [58, 42, 27],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilMediumBrown]: {
        label: 'Util Medium Brown',
        color: [120, 95, 51],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.UtilLightBrown]: {
        label: 'Util Light Brown',
        color: [181, 160, 121],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.MetallicWhite]: {
        label: 'Metallic White',
        color: [255, 255, 246],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicFrostWhite]: {
        label: 'Metallic Frost White',
        color: [234, 234, 234],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.WornHoneyBeige]: {
        label: 'Worn Honey Beige',
        color: [176, 171, 148],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornBrown]: {
        label: 'Worn Brown',
        color: [69, 56, 49],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornDarkBrown]: {
        label: 'Worn Dark Brown',
        color: [42, 40, 43],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornStrawBeige]: {
        label: 'Worn Straw Beige',
        color: [114, 108, 87],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.BrushedSteel]: {
        label: 'Brushed Steel',
        color: [106, 116, 124],
        category: VehicleColorCategory.Metal,
    },
    [VehicleColor.BrushedBlackSteel]: {
        label: 'Brushed Black Steel',
        color: [53, 65, 88],
        category: VehicleColorCategory.Metal,
    },
    [VehicleColor.BrushedAluminium]: {
        label: 'Brushed Aluminium',
        color: [155, 160, 168],
        category: VehicleColorCategory.Metal,
    },
    [VehicleColor.Chrome]: {
        label: 'Chrome',
        color: [88, 112, 161],
        category: VehicleColorCategory.Metal,
    },
    [VehicleColor.WornOffWhite]: {
        label: 'Worn Off White',
        color: [234, 230, 222],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.UtilOffWhite]: {
        label: 'Util Off White',
        color: [223, 221, 208],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.WornOrange]: {
        label: 'Worn Orange',
        color: [242, 173, 46],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornLightOrange]: {
        label: 'Worn Light Orange',
        color: [249, 164, 88],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.MetallicSecuricorGreen]: {
        label: 'Metallic Securicor Green',
        color: [131, 197, 102],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.WornTaxiYellow]: {
        label: 'Worn Taxi Yellow',
        color: [241, 204, 64],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.PoliceCarBlue]: {
        label: 'Police Car Blue',
        color: [76, 195, 218],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MatteGreen]: {
        label: 'Matte Green',
        color: [78, 100, 67],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteBrown]: {
        label: 'Matte Brown',
        color: [188, 172, 143],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteWhite]: {
        label: 'Matte White',
        color: [252, 249, 241],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.WornWhite]: {
        label: 'Worn White',
        color: [255, 255, 251],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.WornOliveArmyGreen]: {
        label: 'Worn Olive Army Green',
        color: [129, 132, 76],
        category: VehicleColorCategory.Classic,
    },
    [VehicleColor.PureWhite]: {
        label: 'Pure White',
        color: [255, 255, 255],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.HotPink]: {
        label: 'Hot Pink',
        color: [242, 31, 153],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.SalmonPink]: {
        label: 'Salmon Pink',
        color: [253, 214, 205],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicVermillionPink]: {
        label: 'Metallic Vermillion Pink',
        color: [223, 88, 145],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.Orange]: {
        label: 'Orange',
        color: [246, 174, 32],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.Green]: {
        label: 'Green',
        color: [176, 238, 110],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.Blue]: {
        label: 'Blue',
        color: [8, 233, 250],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicBlackBlue]: {
        label: 'Metallic Black Blue',
        color: [10, 12, 23],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.MetallicBlackPurple]: {
        label: 'Metallic Black Purple',
        color: [12, 13, 24],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.MetallicBlackRed]: {
        label: 'Metallic Black Red',
        color: [14, 13, 20],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.HunterGreen]: {
        label: 'Hunter Green',
        color: [159, 158, 138],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicPurple]: {
        label: 'Metallic Purple',
        color: [98, 18, 118],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MetallicVDarkBlue]: {
        label: 'Metallic V Dark Blue',
        color: [11, 20, 33],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.ModShopBlack1]: {
        label: 'Modshop Black 1',
        color: [17, 20, 26],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.MattePurple]: {
        label: 'Matte Purple',
        color: [107, 31, 123],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteDarkPurple]: {
        label: 'Matte Dark Purple',
        color: [30, 29, 34],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MetallicLavaRed]: {
        label: 'Metallic Lava Red',
        color: [188, 25, 23],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.MatteForestGreen]: {
        label: 'Matte Forest Green',
        color: [45, 54, 42],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteOliveDrab]: {
        label: 'Matte Olive Drab',
        color: [105, 103, 72],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteDesertBrown]: {
        label: 'Matte Desert Brown',
        color: [122, 108, 85],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteDesertTan]: {
        label: 'Matte Desert Tan',
        color: [195, 180, 146],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.MatteFoliageGreen]: {
        label: 'Matte Foliage Green',
        color: [90, 99, 82],
        category: VehicleColorCategory.Matte,
    },
    [VehicleColor.DefaultAlloyColor]: {
        label: 'Default Alloy Color',
        color: [129, 130, 127],
        category: VehicleColorCategory.Pearly,
    },
    [VehicleColor.EpsilonBlue]: {
        label: 'Epsilon Blue',
        color: [175, 214, 228],
        category: VehicleColorCategory.Metallic,
    },
    [VehicleColor.PureGold]: {
        label: 'Pure Gold',
        color: [122, 100, 64],
        category: VehicleColorCategory.Metal,
    },
    [VehicleColor.BrushedGold]: {
        label: 'Brush Gold',
        color: [127, 106, 72],
        category: VehicleColorCategory.Metal,
    },
};

export const VehicleXenonColorChoices: Record<VehicleXenonColor, VehicleColorChoiceItem> = {
    [VehicleXenonColor.Default]: {
        label: 'Défaut',
        color: [0, 0, 0],
    },
    [VehicleXenonColor.White]: {
        label: 'Blanc',
        color: [222, 222, 255],
    },
    [VehicleXenonColor.Blue]: {
        label: 'Bleu',
        color: [2, 21, 143],
    },
    [VehicleXenonColor.ElectricBlue]: {
        label: 'Bleu éléctrique',
        color: [3, 83, 255],
    },
    [VehicleXenonColor.MintGreen]: {
        label: 'Vert menthe',
        color: [0, 255, 140],
    },
    [VehicleXenonColor.LimeGreen]: {
        label: 'Vert citron',
        color: [94, 255, 1],
    },
    [VehicleXenonColor.Yellow]: {
        label: 'Jaune',
        color: [255, 255, 0],
    },
    [VehicleXenonColor.GoldenShower]: {
        label: 'Jaune pisse',
        color: [255, 150, 0],
    },
    [VehicleXenonColor.Orange]: {
        label: 'Orange',
        color: [255, 62, 0],
    },
    [VehicleXenonColor.Red]: {
        label: 'Rouge',
        color: [255, 1, 1],
    },
    [VehicleXenonColor.PonyPink]: {
        label: 'Rose licorne',
        color: [255, 50, 100],
    },
    [VehicleXenonColor.HotPink]: {
        label: 'Rose pétant',
        color: [255, 5, 190],
    },
    [VehicleXenonColor.Purple]: {
        label: 'Violet',
        color: [35, 1, 255],
    },
    [VehicleXenonColor.Blacklight]: {
        label: 'Lumière noire',
        color: [15, 3, 255],
    },
};

export const VehicleModificationPricing: Partial<Record<keyof VehicleModification, VehicleLsCustomBaseConfigItem>> = {
    engine: {
        priceByLevels: [0.1, 0.15, 0.2, 0.25, 0.3],
        type: 'list',
    },
    brakes: {
        priceByLevels: [0.08, 0.1, 0.12, 0.14, 0.16],
        type: 'list',
    },
    transmission: {
        priceByLevels: [0.08, 0.11, 0.14, 0.17, 0.2],
        type: 'list',
    },
    suspension: {
        priceByLevels: [0.06, 0.09, 0.12, 0.15, 0.18],
        type: 'list',
    },
    armor: {
        priceByLevels: [0.25, 0.35, 0.45, 0.55, 0.65],
        type: 'list',
    },
    turbo: {
        priceByLevels: [0, 0.2],
        type: 'toggle',
    },
};

export const getDefaultVehicleConfiguration = (): VehicleConfiguration => ({
    color: {
        primary: 0,
        secondary: 0,
        pearlescent: null,
        rim: null,
    },
    plateStyle: VehicleLicensePlateStyle.BlueOnWhite1,
    modification: {},
});

export const getVehicleCustomPrice = (
    vehiclePrice: number,
    options: VehicleUpgradeOptions,
    currentModification: VehicleConfiguration,
    newModification: VehicleConfiguration
): number => {
    let price = 0;

    for (const key of Object.keys(VehicleModificationPricing)) {
        const category = VehicleModificationPricing[key];

        if (category.type === 'list') {
            const currentLevel = currentModification.modification[key];
            const newLevel = newModification.modification[key];

            if (currentLevel !== newLevel) {
                const level = category.priceByLevels[newLevel];

                if (level) {
                    price = price + vehiclePrice * level;
                }
            }
        }

        if (category.type === 'toggle') {
            const hasCurrent = currentModification.modification[key];
            const hasNew = newModification.modification[key];

            if (hasCurrent !== hasNew) {
                if (hasNew) {
                    price = price + vehiclePrice * category.priceByLevels[1];
                } else {
                    price = price + vehiclePrice * category.priceByLevels[0];
                }
            }
        }
    }

    return price;
};

export type VehicleCustomMenuData = {
    vehicle: number;
    vehiclePrice?: number;
    options: VehicleUpgradeOptions;
    originalConfiguration: VehicleConfiguration;
    currentConfiguration: VehicleConfiguration;
};

export const HornLabelList: Record<number, { name: string; label: string }> = {
    [-1]: { name: 'CMOD_HRN_0', label: 'Stock Horn' },
    [0]: { name: 'CMOD_HRN_TRK', label: 'Truck Horn' },
    [1]: { name: 'CMOD_HRN_COP', label: 'Police Horn' },
    [2]: { name: 'CMOD_HRN_CLO', label: 'Clown Horn' },
    [3]: { name: 'CMOD_HRN_MUS1', label: 'Musical Horn 1' },
    [4]: { name: 'CMOD_HRN_MUS2', label: 'Musical Horn 2' },
    [5]: { name: 'CMOD_HRN_MUS3', label: 'Musical Horn 3' },
    [6]: { name: 'CMOD_HRN_MUS4', label: 'Musical Horn 4' },
    [7]: { name: 'CMOD_HRN_MUS5', label: 'Musical Horn 5' },
    [8]: { name: 'CMOD_HRN_SAD', label: 'Sad Trombone' },
    [9]: { name: 'HORN_CLAS1', label: 'Classical Horn 1' },
    [10]: { name: 'HORN_CLAS2', label: 'Classical Horn 2' },
    [11]: { name: 'HORN_CLAS3', label: 'Classical Horn 3' },
    [12]: { name: 'HORN_CLAS4', label: 'Classical Horn 4' },
    [13]: { name: 'HORN_CLAS5', label: 'Classical Horn 5' },
    [14]: { name: 'HORN_CLAS6', label: 'Classical Horn 6' },
    [15]: { name: 'HORN_CLAS7', label: 'Classical Horn 7' },
    [16]: { name: 'HORN_CNOTE_C0', label: 'Scale Do' },
    [17]: { name: 'HORN_CNOTE_D0', label: 'Scale Re' },
    [18]: { name: 'HORN_CNOTE_E0', label: 'Scale Mi' },
    [19]: { name: 'HORN_CNOTE_F0', label: 'Scale Fa' },
    [20]: { name: 'HORN_CNOTE_G0', label: 'Scale Sol' },
    [21]: { name: 'HORN_CNOTE_A0', label: 'Scale La' },
    [22]: { name: 'HORN_CNOTE_B0', label: 'Scale Si' },
    [23]: { name: 'HORN_CNOTE_C1', label: 'Scale Do (High)' },
    [24]: { name: 'HORN_HIPS1', label: 'Jazz Horn 1' },
    [25]: { name: 'HORN_HIPS2', label: 'Jazz Horn 2' },
    [26]: { name: 'HORN_HIPS3', label: 'Jazz Horn 3' },
    [27]: { name: 'HORN_HIPS4', label: 'Jazz Horn Loop' },
    [28]: { name: 'HORN_INDI_1', label: 'Star Spangled Banner 1' },
    [29]: { name: 'HORN_INDI_2', label: 'Star Spangled Banner 2' },
    [30]: { name: 'HORN_INDI_3', label: 'Star Spangled Banner 3' },
    [31]: { name: 'HORN_INDI_4', label: 'Star Spangled Banner 4' },
    [32]: { name: 'HORN_LUXE2', label: 'Classical Horn Loop 1' },
    [33]: { name: 'HORN_LUXE1', label: 'Classical Horn 8' },
    [34]: { name: 'HORN_LUXE3', label: 'Classical Horn Loop 2' },
    [35]: { name: 'HORN_LUXE2', label: 'Classical Horn Loop 1' },
    [36]: { name: 'HORN_LUXE1', label: 'Classical Horn 8' },
    [37]: { name: 'HORN_LUXE3', label: 'Classical Horn Loop 2' },
    [38]: { name: 'HORNE_HWEEN1', label: 'Halloween Loop 1' },
    [39]: { name: 'HORNE_HWEEN1', label: 'Halloween Loop 1' },
    [40]: { name: 'HORNE_HWEEN2', label: 'Halloween Loop 2' },
    [41]: { name: 'HORNE_HWEEN2', label: 'Halloween Loop 2' },
    [42]: { name: 'HORN_LOWRDER1', label: 'San Andreas Loop' },
    [43]: { name: 'HORN_LOWRDER1', label: 'San Andreas Loop' },
    [44]: { name: 'HORN_LOWRDER2', label: 'Liberty City Loop' },
    [45]: { name: 'HORN_LOWRDER2', label: 'Liberty City Loop' },
    [46]: { name: 'HORN_XM15_1', label: 'Festive Loop 1' },
    [47]: { name: 'HORN_XM15_2', label: 'Festive Loop 2' },
    [48]: { name: 'HORN_XM15_3', label: 'Festive Loop 3' },
};

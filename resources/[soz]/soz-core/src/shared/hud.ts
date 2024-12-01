export enum HudComponent {
    WantedStars = 1,
    WeaponIcon = 2,
    Cash = 3,
    MpCash = 4,
    MpMessage = 5,
    VehicleName = 6,
    AreaName = 7,
    VehicleClass = 8,
    StreetName = 9,
    HelpText = 10,
    FloatingHelpText1 = 11,
    FloatingHelpText2 = 12,
    CashChange = 13,
    Reticle = 14,
    SubtitleText = 15,
    RadioStationsWheel = 16,
    SavingGame = 17,
    GameStream = 18,
    WeaponWheel = 19,
    WeaponWheelStats = 20,
    HudComponents = 21,
    HudWeapons = 22,
}

export type Minimap = {
    X: number;
    Y: number;
    height: number;
    width: number;
    bottom: number;
    left: number;
    right: number;
    top: number;
    isHidden: boolean;
};

export type HudDateTime = {
    hour: number;
    minute: number;
    dayOfWeek: number;
};

export type HudCompass = {
    degree: number;
    cardinal: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
};

export enum VoiceMode {
    Mute = -1,
    Whisper,
    Normal,
    Shouting,
    Microphone = 9,
    Megaphone,
}

export enum HudTheme {
    Auto = 'auto',
    Deuteranopie = 'deuteranopie',
    Trichromatisme = 'trichromatisme',
    Light = 'light',
    Dark = 'dark',
    Green = 'green',
    Uwu = 'uwu',
    HalloweenVein = 'halloween-vein',
}

export type AvailableTheme = Record<HudTheme, boolean>;
export type ThemeConfig = {
    label: string;
    item?: string;
};

export const AllThemesConfig: Record<HudTheme, ThemeConfig> = {
    [HudTheme.Auto]: { label: 'Auto' },
    [HudTheme.Deuteranopie]: { label: 'Deutéranopie' },
    [HudTheme.Trichromatisme]: { label: 'Trichromatisme' },
    [HudTheme.Light]: { label: 'Light Mode' },
    [HudTheme.Dark]: { label: 'Dark Mode' },
    [HudTheme.Green]: { label: 'Green Mode' },
    [HudTheme.Uwu]: { label: 'UwU Mode' },
    [HudTheme.HalloweenVein]: { label: 'Halloween', item: 'halloween_smartwatch_nocturnal_vein' },
};

export type HudSettings = {
    theme: HudTheme;
    availableTheme: HudTheme[];
    zoom: number;
    inventorySize: number;
    showDateTime: boolean;
    showWeather: boolean;
    showStreetName: boolean;
    showCompass: boolean;
    showStress: boolean;
    showStamina: boolean;
    showInstructionalOverlay: boolean;
};

export type HudState = {
    hasWatch: boolean;
    armorPlates: number;
    settings: HudSettings;
    voiceMode: VoiceMode;
    streetName: string[];
    compass: HudCompass;
    ammo: HudWeaponAmmo;
    dateTime: HudDateTime & {
        isNight: boolean;
    };
    minimap: Minimap;
    halloween: {
        moon: boolean;
    };
    useGlassmorphism: boolean;
};

export enum Font {
    ChaletLondon = 0,
    HouseScript = 1,
    Monospace = 2,
    ChaletComprimeCologne = 4,
    Pricedown = 7,
}

export type HudWeaponAmmo = {
    hasWeapon: boolean;
    ammo: number;
    maxAmmo: number;
};

export type ScreenSelectMode = 'closest' | 'screen' | 'screen_fallback_closest';

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
};

export enum VoiceMode {
    Normal,
    Shouting,
    Whisper,
    Mute,
    Microphone,
    Megaphone,
}

export type HudState = {
    minimap: Minimap;
    voiceMode: VoiceMode;
};

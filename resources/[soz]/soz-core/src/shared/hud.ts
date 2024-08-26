import { JobType } from '@public/shared/job';
import { Vector3 } from '@public/shared/polyzone/vector';

export type HubInteraction = {
    coords?: Vector3;
    entity?: number;
    option: HubInteractionOption;
};

export type HubInteractionOption = {
    label: string;
    blackoutGlobal?: boolean;
    blackoutJob?: string;
    canInteract?: (entity) => boolean | Promise<boolean>;
    action?: (entity) => void;
    job?: string | JobType | Partial<{ [key in JobType]: number }>;
    item?: string;
};

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

export type HudState = {
    hasWatch: boolean;
    hasCompass: boolean;

    voiceMode: VoiceMode;
    streetName: string[];
    compass: HudCompass;
    dateTime: HudDateTime;
    minimap: Minimap;
};

export enum Font {
    ChaletLondon = 0,
    HouseScript = 1,
    Monospace = 2,
    ChaletComprimeCologne = 4,
    Pricedown = 7,
}

import { VoiceMode } from '@public/shared/hud';
import { Vector3 } from '@public/shared/polyzone/vector';

export const VOICE_TARGET = 1;

export type AudioContextType = 'radio' | 'car' | 'eodrobot' | 'proximity' | 'megaphone' | 'phone_speaker' | 'phone';

export type AudioContextRadio = {
    position: Vector3;
    type: 'radio';
    frequency: number;
    radioType: RadioType;
    ear: Ear;
    volume: number;
    priority: 2;
};

export type AudioContextCar = {
    type: 'car';
    priority: 3;
};

export type AudioContextProximity = {
    type: 'proximity';
    priority: 6;
};

export type AudioContextEodRobot = {
    type: 'eodrobot';
    priority: 5;
};

export type AudioContextMegaphone = {
    type: 'megaphone';
    priority: 4;
};

export type AudioContextPhone = {
    type: 'phone';
    priority: 1;
};

export type AudioContextPhoneSpeaker = {
    type: 'phone_speaker';
    priority: 2;
};

export type AudioContext =
    | AudioContextRadio
    | AudioContextCar
    | AudioContextProximity
    | AudioContextEodRobot
    | AudioContextMegaphone
    | AudioContextPhone
    | AudioContextPhoneSpeaker;

export type PlayerVoice = {
    serverId: number;
    contexts: Partial<Record<AudioContextType, AudioContext>>;
};

export type RadioChannel = {
    frequency: number;
    volume: number;
    ear: Ear;
};

export type Radio = {
    enabled: boolean;
    primary: RadioChannel;
    secondary: RadioChannel;
};

export type RadioWithVolumeClick = Radio & {
    primaryClickVolume: number;
    secondaryClickVolume: number;
};

export enum RadioType {
    RadioLongRange = 'radio-lr',
    RadioShortRange = 'radio-sr',
}

export enum RadioChannelType {
    Primary = 'primary',
    Secondary = 'secondary',
}

export enum Ear {
    Left,
    Both,
    Right,
}

export type VoiceDebugInfo = {
    proximity: number;
    networkProximity: number;
    voiceMode: VoiceMode;
    overrideInputRange: number | null;
    targets: Record<number, AudioContextType[]>;
    listeners: PlayerVoice[];
    submixes: [number, number][];
};

export function getDefaultRadioState(): Radio {
    return {
        enabled: false,
        primary: {
            ear: Ear.Both,
            frequency: 0,
            volume: 50,
        },
        secondary: {
            ear: Ear.Both,
            frequency: 0,
            volume: 50,
        },
    };
}

import { VoiceMode } from '@public/shared/hud';
import { Vector3 } from '@public/shared/polyzone/vector';

export const VOICE_TARGET = 1;

export type AudioContextType = 'radio' | 'car' | 'proximity' | 'megaphone' | 'phone';

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

export type AudioContext =
    | AudioContextRadio
    | AudioContextCar
    | AudioContextProximity
    | AudioContextMegaphone
    | AudioContextPhone;

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

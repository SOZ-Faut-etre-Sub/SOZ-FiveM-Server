import { Vector4 } from './polyzone/vector';
import { VehicleConfiguration } from './vehicle/modification';

export type RaceRankingInfo = {
    max: number;
    ranks: RaceRanking[];
};

export type RaceRanking = {
    name?: string;
    time: number;
    citizenId: string;
};

export type Race = {
    id: number;
    name: string;
    npcPosition: Vector4;
    start: Vector4;
    checkpoints: Vector4[];
    carModel: string;
    enabled: boolean;
    display?: boolean;
    npc?: number;
    fps: boolean;
    garageLocation: Vector4;
    vehicleConfiguration: VehicleConfiguration;
};

export enum RaceCheckpointMenuOptions {
    delete = 'Supprimer',
    edit = 'Modifier Zone',
    goto = 'Téléportation',
}
export enum RaceUpdateMenuOptions {
    npc = 'PNJ',
    start = 'Départ',
    garage = 'garage',
}
export enum RaceLaunchMenuOptions {
    test = 'Tester',
    play = 'Jouer',
}
export enum RaceVehConfigurationOptions {
    current = 'Véhicule Actuel',
    default = 'Par défaut',
}

export function getDurationStr(ms: number) {
    const timeMinutes = Math.floor(ms / 60000.0);
    const timeMinutesStr = timeMinutes >= 10 ? timeMinutes.toString() : '0' + timeMinutes.toString();
    const timeSeconds = (ms - 60000 * timeMinutes) / 1000.0;
    const timeSecondsStr = timeSeconds > 10 ? timeSeconds.toFixed(3) : '0' + timeSeconds.toFixed(3);

    return timeMinutesStr + ':' + timeSecondsStr;
}

export function getDurationDeltateStr(ms: number) {
    let negative = false;
    if (ms < 0) {
        negative = true;
        ms = -ms;
    }

    const timeMinutes = Math.floor(ms / 60000.0);
    const timeMinutesStr = timeMinutes >= 10 ? timeMinutes.toString() : '0' + timeMinutes.toString();
    const timeSeconds = (ms - 60000 * timeMinutes) / 1000.0;
    const timeSecondsStr = timeSeconds > 10 ? timeSeconds.toFixed(3) : '0' + timeSeconds.toFixed(3);

    return (negative ? '-' : '+') + (timeMinutes > 0 ? timeMinutesStr + ':' : '') + timeSecondsStr;
}

export type SplitInfo = {
    current: boolean;
    delta: number;
    deltaColor: string;
    time: number;
};

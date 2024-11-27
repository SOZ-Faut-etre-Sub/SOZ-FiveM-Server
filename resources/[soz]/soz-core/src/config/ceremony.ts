import { FireworkType } from '../shared/firework';
import { Vector3 } from '../shared/polyzone/vector';
import { SENAT_LOCATION } from './ceremony.senat';

export const CAMERA_TRANSITION_DURATION = 1_500;

export type TriggerableAction<T> = T & {
    triggerAt: number[] | number;
};

export type Location = {
    camera: Vector3;
    center: Vector3;
    music?: {
        name: 'society1' | 'society2' | 'senat';
        volume: number;
    };
    targets?: TriggerableAction<{
        position: Vector3;
    }>[];
    positions: TriggerableAction<{
        position: Vector3;
        rotation: Vector3;
        duration: number;
    }>[];
    fireworks: TriggerableAction<{
        type: FireworkType;
        position: Vector3;
        height: number;
        scale?: number;
        color?: Vector3;
    }>[];
    spotlights: TriggerableAction<{
        id: string;
        action: 'add' | 'update' | 'remove';
        position?: Vector3;
        target?: Vector3;
        color?: Vector3;
        distance?: number;
        radius?: number;
        roundness?: number;
        duration: number;
        brightness: number;
    }>[];
    duration: number;
};

export const ALL_LOCATIONS: Record<string, Location> = {
    // bcso: BCSO_LOCATION,
    // lspd: LSPD_LOCATION,
    // lsmc: LSMC_LOCATION,
    // stonk: STONK_LOCATION,
    // mandatory: MANDATORY_LOCATION,
    senat: SENAT_LOCATION,
    // final: FINAL_LOCATION,
};

export function triggerPeriodic(start: number, end: number, padding: number) {
    const times = [];
    for (let i = start; i < end; i += padding) {
        times.push(i);
    }
    return times;
}

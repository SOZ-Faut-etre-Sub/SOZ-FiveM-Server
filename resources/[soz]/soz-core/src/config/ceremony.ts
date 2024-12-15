import { FireworkType } from '../shared/firework';
import { Vector3 } from '../shared/polyzone/vector';
import { BCSO_LOCATION } from './ceremony.bcso';
import { FINAL_LOCATION } from './ceremony.final';
import { LSMC_LOCATION } from './ceremony.lsmc';
import { LSPD_LOCATION } from './ceremony.lspd';
import { MANDATORY_LOCATION } from './ceremony.mandatory';
import { SENAT_LOCATION } from './ceremony.senat';
import { STONK_LOCATION } from './ceremony.stonk';

export const CAMERA_TRANSITION_DURATION = 1_500;
export const WAIT_BETWEEN_CEREMONY = 2_000;

export type TriggerableAction<T> = T & {
    triggerAt: number[] | number;
};

export type Location = {
    camera: Vector3;
    center: Vector3;
    music?: {
        name: 'society1' | 'society2' | 'senat' | 'hymne';
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

export const PUBLIC_CEREMONY: Record<string, Location> = {
    bcso: BCSO_LOCATION,
    lspd: LSPD_LOCATION,
    lsmc: LSMC_LOCATION,
    stonk: STONK_LOCATION,
    mandatory: MANDATORY_LOCATION,
    senat: SENAT_LOCATION,
};

export const FINAL_CEREMONY: Record<string, Location> = {
    final: FINAL_LOCATION,
};

export const ALL_LOCATIONS: Record<string, Location> = {
    ...PUBLIC_CEREMONY,
    ...FINAL_CEREMONY,
};

export function triggerPeriodic(start: number, end: number, padding: number) {
    const times = [];
    for (let i = start; i < end; i += padding) {
        times.push(i);
    }
    return times;
}

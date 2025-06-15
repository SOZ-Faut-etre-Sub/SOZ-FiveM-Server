import { RGBColor } from './color';
import { Vector3 } from './polyzone/vector';

export type Spotlight = {
    position: Vector3;
    direction: Vector3;
    color: RGBColor;
    distance: number;
    roundness: number;
    radius: number;
    falloff: number;
    currentBrightness: number;
    targetBrightness: number;
    currentDuration: number;
    targetDuration: number;
};

export type LightStateTransition = {
    duration: number;
    next: NextState;
};

export type LightStateAnimation = {
    loop: boolean;
    cycle?: number;
    transitions: LightStateTransition[];
};

export type LightState = {
    position: Vector3;
    direction: Vector3;
    color: RGBColor;
    brightness: number;
};

export type NextState = {
    direction?: Vector3;
    rotation?: Vector3;
    color?: RGBColor;
    enabled?: boolean;
};

export const getStateWithNext = (current: LightState, next: NextState): LightState => {
    const newState: LightState = { ...current };

    if (next.direction) {
        newState.direction = next.direction;
    }

    if (next.rotation) {
        newState.direction = [...newState.direction];
        newState.direction[0] = (newState.direction[0] + next.rotation[0]) % 360;
        newState.direction[1] = (newState.direction[1] + next.rotation[1]) % 360;
        newState.direction[2] = (newState.direction[2] + next.rotation[2]) % 360;
    }

    if (next.color) {
        newState.color = next.color;
    }

    if (next.enabled !== undefined) {
        if (next.enabled) {
            newState.brightness = 1;
        } else {
            newState.brightness = 0;
        }
    }

    return newState;
};

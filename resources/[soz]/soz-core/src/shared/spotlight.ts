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
    next: Partial<LightState>;
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
    enabled: boolean;
};

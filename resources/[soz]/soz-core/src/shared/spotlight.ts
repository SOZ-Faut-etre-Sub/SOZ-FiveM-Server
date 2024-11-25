import { RGBColor } from './color';
import { Vector3 } from './polyzone/vector';

export type Spotlight = {
    position: Vector3;
    direction: Vector3;
    color: RGBColor;
    distance: number;
    roundness: number;
    radius: number;
    duration: number;

    // Optional
    currentBrightness: number;
    targetBrightness: number;
};

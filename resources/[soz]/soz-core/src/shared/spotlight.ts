import { RGBColor } from './color';
import { Vector3 } from './polyzone/vector';

export type Spotlight = {
    position: Vector3;
    direction: Vector3;
    color: RGBColor;
    distance: number;
    roundness: number;
    radius: number;
    currentBrightness: number;
    targetBrightness: number;
    currentDuration: number;
    targetDuration: number;
};

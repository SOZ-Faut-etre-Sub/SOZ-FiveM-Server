import { RGBColor } from '../color';
import { Point3D } from './vector';

export interface AbstractZone {
    isPointInside(point: Point3D): boolean;
    draw(wallColor: RGBColor, alpha: number): void;
}

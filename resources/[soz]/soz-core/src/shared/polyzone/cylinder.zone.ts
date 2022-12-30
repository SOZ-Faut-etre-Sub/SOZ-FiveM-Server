import { RGBColor } from '../color';
import { AbstractZone } from './abstract.zone';
import { Point2D, Point3D } from './vector';

export class CylinderZone implements AbstractZone {
    public readonly center: Point2D;
    public readonly radiusquare: number;
    public readonly radius: number;
    public readonly minZ: number;
    public readonly maxZ: number;

    constructor(center: Point2D, radius: number, minZ: number, maxZ: number) {
        this.center = center;
        this.radius = radius;
        this.radiusquare = radius * radius;
        this.minZ = minZ;
        this.maxZ = maxZ;
    }

    public isPointInside(point: Point3D): boolean {
        return (
            Vdist2(this.center[0], this.center[1], 0, point[0], point[1], 0) <= this.radiusquare &&
            point[2] >= this.minZ &&
            point[2] <= this.maxZ
        );
    }

    public draw(wallColor: RGBColor, alpha: number): void {
        DrawMarker(
            1,
            this.center[0],
            this.center[1],
            this.minZ,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            2 * this.radius,
            2 * this.radius,
            this.maxZ - this.minZ,
            wallColor[0],
            wallColor[1],
            wallColor[2],
            alpha,
            false,
            false,
            2,
            false,
            null,
            null,
            false
        );
    }
}

import { Point2D, Point3D, Vector3 } from './vector';

type BoxZoneOptions = {
    minZ?: number;
    maxZ?: number;
    heading?: number;
    data?: any;
};

export type Zone = {
    center: Vector3;
    length?: number;
    width?: number;
    heading?: number;
    minZ?: number;
    maxZ?: number;
    debugPoly?: boolean;
    data?: any;
};

export type NamedZone = Zone & {
    name: string;
};

const rotatePoint = (center: Point2D | Point3D, point: Point2D | Point3D, angleInRad: number): Point2D => {
    const cos = Math.cos(angleInRad);
    const sin = Math.sin(angleInRad);

    const x = point[0] - center[0];
    const y = point[1] - center[1];

    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;

    return [newX + center[0], newY + center[1]];
};

export class BoxZone {
    private readonly center: Point3D;
    private readonly length: number;
    private readonly width: number;
    private readonly minZ: number;
    private readonly maxZ: number;
    private readonly heading: number;
    private readonly min: Readonly<Point3D>;
    private readonly max: Readonly<Point3D>;

    public constructor(center: Point3D, length: number, width: number, options?: BoxZoneOptions) {
        this.center = center;
        this.length = length;
        this.width = width;
        this.minZ = options?.minZ || center[2] - 1;
        this.maxZ = options?.maxZ || center[2] + 2;
        this.heading = ((options?.heading || 0) * Math.PI) / 180;

        const min = [center[0] - width / 2, center[1] - length / 2] as Point2D;
        const max = [center[0] + width / 2, center[1] + length / 2] as Point2D;

        this.min = [min[0], min[1], center[2] - this.minZ];
        this.max = [max[0], max[1], center[2] + this.maxZ];
    }

    public isPointInside(point: Point3D): boolean {
        if (this.heading !== 0) {
            const rotatedPoint = rotatePoint(this.center, point, -this.heading);

            point = [rotatedPoint[0], rotatedPoint[1], point[2]];
        }

        return (
            point[0] >= this.min[0] &&
            point[0] <= this.max[0] &&
            point[1] >= this.min[1] &&
            point[1] <= this.max[1] &&
            point[2] >= this.min[2] &&
            point[2] <= this.max[2]
        );
    }

    public draw() {
        DrawBox(this.min[0], this.min[1], this.min[2], this.max[0], this.max[1], this.max[2], 0, 255, 0, 80);
        DrawLine(this.min[0], this.min[1], this.min[2], this.min[0], this.min[1], this.max[2], 255, 0, 255, 255);
        DrawLine(this.max[0], this.max[1], this.min[2], this.max[0], this.max[1], this.max[2], 255, 0, 255, 255);
    }
}

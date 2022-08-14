import { Point3D } from './vector';

type BoxZoneOptions = {
    minZ?: number;
    maxZ?: number;
};

export class BoxZone {
    private readonly center: Point3D;
    private readonly length: number;
    private readonly width: number;
    private readonly minZ: number;
    private readonly maxZ: number;
    private readonly min: Readonly<Point3D>;
    private readonly max: Readonly<Point3D>;

    public constructor(center: Point3D, length: number, width: number, options?: BoxZoneOptions) {
        this.center = center;
        this.length = length;
        this.width = width;
        this.minZ = options?.minZ || center[2] - 1;
        this.maxZ = options?.maxZ || center[2] + 2;

        this.min = [center[0] - length / 2, center[1] - width / 2, center[2] - this.minZ];
        this.max = [center[0] + length / 2, center[1] + width / 2, center[2] + this.maxZ];
    }

    public isPointInside(point: Point3D): boolean {
        return (
            point[0] >= this.min[0] &&
            point[0] <= this.max[0] &&
            point[1] >= this.min[1] &&
            point[1] <= this.max[1] &&
            point[2] >= this.min[2] &&
            point[2] <= this.max[2]
        );
    }
}

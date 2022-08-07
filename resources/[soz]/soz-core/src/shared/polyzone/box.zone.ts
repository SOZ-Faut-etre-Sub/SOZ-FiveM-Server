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
        this.minZ = options?.minZ || center.z - 1;
        this.maxZ = options?.maxZ || center.z + 2;

        this.min = { x: center.x - length / 2, y: center.y - width / 2, z: center.z - this.minZ };
        this.max = { x: center.x + length / 2, y: center.y + width / 2, z: center.z + this.maxZ };
    }

    public isPointInside(point: Point3D): boolean {
        return (
            point.x >= this.min.x &&
            point.x <= this.max.x &&
            point.y >= this.min.y &&
            point.y <= this.max.y &&
            point.z >= this.min.z &&
            point.z <= this.max.z
        );
    }
}

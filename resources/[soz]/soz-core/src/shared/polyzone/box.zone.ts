import { PolygonZone, PolygonZoneOptions } from './polygon.zone';
import { Point2D, Point3D, Vector2, Vector3, Vector4 } from './vector';

type BoxZoneOptions<T> = PolygonZoneOptions<T> & {
    heading?: number;
};

export type Zone<T = never> = {
    center: Vector3 | Vector4;
    length?: number;
    width?: number;
    heading?: number;
    minZ?: number;
    maxZ?: number;
    debugPoly?: boolean;
    data?: T;
};

export type NamedZone<T = never> = Zone<T> & {
    name: string;
};

const rotatePoint = (center: Point2D | Point3D | Vector4, point: Point2D | Point3D, angleInRad: number): Point2D => {
    const cos = Math.cos(angleInRad);
    const sin = Math.sin(angleInRad);

    const x = point[0] - center[0];
    const y = point[1] - center[1];

    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;

    return [newX + center[0], newY + center[1]];
};

export class BoxZone<T = never> extends PolygonZone<T> {
    public readonly center: Point3D | Vector4;
    public readonly length: number;
    public readonly width: number;
    public readonly heading: number;

    public static fromZone<T>(zone: Zone<T>): BoxZone<T> {
        return new BoxZone(zone.center, zone.length || 1, zone.width || 1, {
            minZ: zone.minZ,
            maxZ: zone.maxZ,
            data: zone.data,
            heading: zone.heading,
        });
    }

    public constructor(center: Point3D | Vector4, length: number, width: number, options?: BoxZoneOptions<T>) {
        const points: Vector2[] = [];
        const heading = options?.heading || 0;
        const angleInRad = (heading * Math.PI) / 180;

        points.push(rotatePoint(center, [center[0] - width / 2, center[1] - length / 2], angleInRad));
        points.push(rotatePoint(center, [center[0] - width / 2, center[1] + length / 2], angleInRad));
        points.push(rotatePoint(center, [center[0] + width / 2, center[1] + length / 2], angleInRad));
        points.push(rotatePoint(center, [center[0] + width / 2, center[1] - length / 2], angleInRad));
        points.push(rotatePoint(center, [center[0] - width / 2, center[1] - length / 2], angleInRad));

        super(points, options);

        this.center = center;
        this.length = length;
        this.width = width;
        this.heading = heading;
    }
}

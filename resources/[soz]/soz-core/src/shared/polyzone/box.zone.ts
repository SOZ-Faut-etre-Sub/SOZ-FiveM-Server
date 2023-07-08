import { RGBAColor, RGBColor } from '@public/shared/color';

import { PolygonZone, PolygonZoneOptions } from './polygon.zone';
import { Point3D, rotatePoint, Vector2, Vector3, Vector4 } from './vector';

type BoxZoneOptions<T> = PolygonZoneOptions<T> & {
    heading?: number;
    debugPoly?: boolean;
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

export type LegacyHousingZone = {
    x: number;
    y: number;
    z: number;
    sx: number;
    sy: number;
    heading: number;
    minZ?: number;
    maxZ?: number;
};

export const createZoneFromLegacyData = (data: LegacyHousingZone): Zone | null => {
    if (data === null) {
        return null;
    }

    return {
        center: [data.x, data.y, data.z],
        length: data.sx,
        width: data.sy,
        heading: data.heading,
        minZ: data.minZ,
        maxZ: data.maxZ,
    };
};

export const zoneToLegacyData = (zone: Zone): LegacyHousingZone => {
    return {
        x: zone.center[0],
        y: zone.center[1],
        z: zone.center[2],
        sx: zone.length,
        sy: zone.width,
        heading: zone.heading,
        minZ: zone.minZ,
        maxZ: zone.maxZ,
    };
};

export type NamedZone<T = never> = Zone<T> & {
    name: string;
};

export class BoxZone<T = never> extends PolygonZone<T> {
    public readonly center: Point3D | Vector4;
    public readonly length: number;
    public readonly width: number;
    public readonly heading: number;
    public readonly debugPoly: boolean;

    public static fromZone<T>(zone: Zone<T>): BoxZone<T> {
        return new BoxZone(zone.center, zone.length || 1, zone.width || 1, {
            minZ: zone.minZ,
            maxZ: zone.maxZ,
            data: zone.data,
            heading: zone.heading,
        });
    }

    public static default<T>(
        center: Point3D | Vector4,
        length = 1,
        width = 1,
        options?: BoxZoneOptions<T>
    ): BoxZone<T> {
        return new BoxZone(center, length, width, {
            minZ: center[2] - 1,
            maxZ: center[2] + 2,
            heading: center[3] || 0,
            ...options,
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

    public draw(wallColor: RGBAColor | RGBColor, alpha?: number, text?: string) {
        super.draw(wallColor, alpha);

        const angleInRad = (this.heading * Math.PI) / 180;

        const a = rotatePoint(
            this.center,
            [this.center[0] + this.width / 2, this.center[1] - this.length / 2],
            angleInRad
        ) as Vector2;
        const b = rotatePoint(
            this.center,
            [this.center[0] - this.width / 2, this.center[1] - this.length / 2],
            angleInRad
        ) as Vector2;

        const collisionPosition = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

        DrawLine(
            this.center[0],
            this.center[1],
            this.center[2],
            collisionPosition[0],
            collisionPosition[1],
            this.maxZ,
            255,
            0,
            0,
            255
        );
        DrawLine(
            this.center[0],
            this.center[1],
            this.center[2],
            collisionPosition[0],
            collisionPosition[1],
            this.minZ,
            255,
            0,
            0,
            255
        );
        DrawLine(
            collisionPosition[0],
            collisionPosition[1],
            this.maxZ,
            collisionPosition[0],
            collisionPosition[1],
            this.minZ,
            255,
            0,
            0,
            255
        );

        if (text) {
            const [onScreen, _x, _y] = World3dToScreen2d(this.center[0], this.center[1], this.center[2]);

            if (onScreen) {
                SetTextScale(0.35, 0.35);
                SetTextFont(4);
                SetTextProportional(true);
                SetTextColour(255, 255, 255, 255);
                SetTextEntry('STRING');
                SetTextCentre(true);
                AddTextComponentString(text);
                DrawText(_x, _y);
            }
        }
    }

    public toZone(): Zone<T> {
        return {
            center: this.center,
            length: this.length,
            width: this.width,
            heading: this.heading,
            minZ: this.minZ,
            maxZ: this.maxZ,
            debugPoly: this.debugPoly,
            data: this.data,
        };
    }
}

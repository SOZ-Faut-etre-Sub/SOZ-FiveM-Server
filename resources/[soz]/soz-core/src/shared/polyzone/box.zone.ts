import { RGBAColor, RGBColor } from '@public/shared/color';

import { PolygonZone, PolygonZoneOptions } from './polygon.zone';
import { Point3D, rotatePoint, Vector2, Vector3, Vector4 } from './vector';

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

export enum ZoneType {
    NoStress = 'NoStress',
    VehBizSpawn = 'VehBizSpawn',
    VehBizDelivery = 'VehBizDelivery',
    VehBizResell = 'VehBizResell',
    VehBizGarage = 'VehBizGarage',
    SmugglingBizStorage = 'SmugglingBizStorage',
    SmugglingBizContainer = 'SmugglingBizContainer',
    SmugglingBizExport = 'SmugglingBizExport',
    SmugglingBizConvoy = 'SmugglingBizConvoy',
    NoHackCam = 'NoHackCam',
    CyberHeistEntry = 'CyberHeistEntry',
}

export const ZoneTypeLabel: Record<ZoneType, string> = {
    NoStress: 'No stress zone',
    VehBizSpawn: 'VehBiz Spawn de véhicule',
    VehBizDelivery: 'VehBiz Conteneur de livraison',
    VehBizResell: 'VehBiz Revente de caisse',
    VehBizGarage: 'VehBiz Garage',
    SmugglingBizStorage: 'Coffre contrebande connecté',
    SmugglingBizContainer: 'Contrebande import',
    SmugglingBizExport: 'Contrebande Export',
    SmugglingBizConvoy: 'Contrebande Convoi',
    NoHackCam: 'Protection Hack Caméra',
    CyberHeistEntry: 'Entrée de braquage cyber',
};

export const ZoneTypeBlipColor: Record<ZoneType, number> = {
    NoStress: 0,
    VehBizSpawn: 1,
    VehBizDelivery: 2,
    VehBizResell: 3,
    VehBizGarage: 5,
    SmugglingBizStorage: 6,
    SmugglingBizContainer: 7,
    SmugglingBizExport: 8,
    SmugglingBizConvoy: 9,
    NoHackCam: 10,
    CyberHeistEntry: 11,
};

export type ZoneExtra = {
    date?: number;
};

export type ZoneTyped = Zone<{
    id: number;
    type: ZoneType;
    name: string;
    extra?: ZoneExtra;
}>;

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
            data: this.data,
        };
    }
}

export const zoneToString = (zone: Zone<any>): string => {
    return `{"center": [${zone.center[0].toFixed(2)}, ${zone.center[1].toFixed(2)}, ${zone.center[2].toFixed(
        2
    )}], "heading": ${zone.heading.toFixed(2)}, "length": ${(zone.length || 1.0).toFixed(2)}, "maxZ": ${(
        zone.maxZ || zone.center[2] + 2.0
    ).toFixed(2)}, "minZ": ${(zone.minZ || zone.center[2] - 1.0).toFixed(2)}, "width": ${(zone.width || 1.0).toFixed(
        2
    )}}`;
};

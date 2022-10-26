import { PolygonZone } from './polygon.zone';
import { Point3D } from './vector';

export class MultiZone<T extends PolygonZone> {
    public zones: T[];

    public constructor(zones: T[]) {
        this.zones = zones;
    }

    public isPointInside(point: Point3D): boolean {
        return this.zones.some(zone => zone.isPointInside(point));
    }
}

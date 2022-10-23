import { PolygonZone } from './polygon.zone';
import { Point3D } from './vector';

export class MultiZone {
    public zones: PolygonZone[];

    public constructor(zones: PolygonZone[]) {
        this.zones = zones;
    }

    public isPointInside(point: Point3D): boolean {
        return this.zones.some(zone => zone.isPointInside(point));
    }
}

import { PolygonZone } from '../../../shared/polyzone/polygon.zone';

export interface LocationZone {
    get id(): string;
    get zones(): Record<string, PolygonZone>;
}

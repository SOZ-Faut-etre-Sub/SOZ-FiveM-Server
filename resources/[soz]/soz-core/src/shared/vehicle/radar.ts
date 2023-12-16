import { CylinderZone } from '../polyzone/cylinder.zone';
import { Vector4 } from '../polyzone/vector';

export const radarPrefix = 'radar_';

export type Radar = {
    props: Vector4;
    zone: CylinderZone;
    isOnline: boolean;
    speed: number;
    objectId?: string;
    disableTime?: number;
    destroyed?: boolean;
};

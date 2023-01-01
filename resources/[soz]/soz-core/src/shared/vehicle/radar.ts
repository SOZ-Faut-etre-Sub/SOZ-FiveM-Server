import { JobType } from '../../shared/job';
import { CylinderZone } from '../polyzone/cylinder.zone';
import { Vector4 } from '../polyzone/vector';

export type Radar = {
    props: Vector4;
    zone: CylinderZone;
    station: JobType.LSPD | JobType.BCSO;
    isOnline: boolean;
    speed: number;
};

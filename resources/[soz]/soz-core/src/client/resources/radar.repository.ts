import { RadarList } from '@public/config/radar';
import { Radar } from '@public/shared/vehicle/radar';

import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class RadarRepository {
    public get(): Record<number, Radar> {
        return RadarList;
    }

    public find(name: string): Radar | undefined {
        return RadarList[name];
    }

    public findByEntity(entity: number): string | null {
        for (const [radarID, radar] of Object.entries(RadarList)) {
            if (radar.entity && radar.entity == entity) {
                return radarID;
            }
        }
        return null;
    }

    public disable(id: string, duration: number) {
        const disableEndTime = Math.round(Date.now() / 1000 + duration);
        RadarList[id].disableTime = disableEndTime;
        SetResourceKvpInt('radar/disableEndTime/' + id, disableEndTime);
    }
}

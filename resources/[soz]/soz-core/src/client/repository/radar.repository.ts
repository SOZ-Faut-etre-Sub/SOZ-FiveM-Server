import { Inject, Injectable } from '@core/decorators/injectable';
import { ObjectProvider } from '@public/client/object/object.provider';
import { RadarList } from '@public/config/radar';
import { Radar, radarPrefix } from '@public/shared/vehicle/radar';

@Injectable()
export class RadarRepository {
    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    public get(): Record<number, Radar> {
        return RadarList;
    }

    public find(name: string): Radar | undefined {
        return RadarList[name];
    }

    public findByEntity(entity: number): string | null {
        const objectId = this.objectProvider.getIdFromEntity(entity);

        if (!objectId) {
            return null;
        }

        for (const [radarID, radar] of Object.entries(RadarList)) {
            if (radar.objectId && radar.objectId == objectId) {
                return radarID;
            }
        }

        return null;
    }

    public disable(id: string, duration: number) {
        if (id.startsWith(radarPrefix)) {
            id = id.replace(radarPrefix, '');
        }
        const disableEndTime = Math.round(Date.now() / 1000 + duration);
        RadarList[id].disableTime = disableEndTime;
        SetResourceKvpInt('radar/disableEndTime/' + id, disableEndTime);
    }
}

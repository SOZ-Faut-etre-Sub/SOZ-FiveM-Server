import { Injectable } from '@core/decorators/injectable';
import { TargetStoreData } from '@public/client/target/target.store.data';
import { joaat } from '@public/shared/joaat';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { PolygonZone } from '@public/shared/polyzone/polygon.zone';
import { TargetOption } from '@public/shared/target';

const DEFAULT_DISTANCE = 2.5;

export type TargetStoreBase = {
    targets: TargetOption[];
    distance: number;
};

type TargetStoreZone = TargetStoreBase & {
    zone: BoxZone<any> | PolygonZone<any>;
};

@Injectable()
export class TargetStore {
    public zones: TargetStoreData<TargetStoreZone> = new TargetStoreData<TargetStoreZone>();
    public models: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public peds: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public players: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public entities: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public vehicles: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public bones: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();

    public async addZone(
        id: string,
        zone: TargetStoreZone['zone'],
        targets: TargetStoreZone['targets'],
        distance = DEFAULT_DISTANCE
    ): Promise<void> {
        await this.zones.add(id, { zone, targets, distance });
    }

    public async addModels(
        models: string[] | number[] | string | number,
        targets: TargetStoreBase['targets'],
        distance = DEFAULT_DISTANCE
    ): Promise<boolean> {
        if (models instanceof Array) {
            for (const model of models) {
                await this.models.add(this.getId(model), { targets, distance });
            }
            return true;
        }

        return this.models.add(this.getId(models), { targets, distance });
    }

    public async addEntities(
        entities: string[] | number[] | string | number,
        targets: TargetStoreBase['targets'],
        distance = DEFAULT_DISTANCE
    ): Promise<void> {
        if (entities instanceof Array) {
            for (const entity of entities) {
                await this.entities.add(entity.toString(), { targets, distance });
            }
            return;
        }

        await this.entities.add(entities.toString(), { targets, distance });
    }

    public async addBones(
        bones: string[] | string,
        targets: TargetStoreBase['targets'],
        distance = DEFAULT_DISTANCE
    ): Promise<void> {
        if (bones instanceof Array) {
            for (const bone of bones) {
                await this.bones.add(bone.toString(), { targets, distance });
            }
            return;
        }

        await this.bones.add(bones.toString(), { targets, distance });
    }

    public getId(id: string | number): string {
        if (typeof id === 'number') return id.toString();
        return joaat(id).toString();
    }
}

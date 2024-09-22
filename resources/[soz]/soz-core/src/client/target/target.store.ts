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

type TargetStoreModel = TargetStoreBase & {
    model: string;
};

type TargetStoreEntity = TargetStoreBase & {
    entity: number;
};

type TargetStorePed = TargetStoreBase & {
    ped: number;
};

type TargetStorePlayer = TargetStoreBase & {
    player: number;
};

type TargetStoreVehicle = TargetStoreBase & {
    vehicle: number;
};

type TargetStoreBone = TargetStoreBase & {
    bone: string;
};

@Injectable()
export class TargetStore {
    public zones: TargetStoreData<TargetStoreZone> = new TargetStoreData<TargetStoreZone>();
    public models: TargetStoreData<TargetStoreModel> = new TargetStoreData<TargetStoreModel>();
    public peds: TargetStoreData<TargetStorePed> = new TargetStoreData<TargetStorePed>();
    public players: TargetStoreData<TargetStorePlayer> = new TargetStoreData<TargetStorePlayer>();
    public entities: TargetStoreData<TargetStoreEntity> = new TargetStoreData<TargetStoreEntity>();
    public vehicles: TargetStoreData<TargetStoreVehicle> = new TargetStoreData<TargetStoreVehicle>();
    public bones: TargetStoreData<TargetStoreBone> = new TargetStoreData<TargetStoreBone>();

    public async addZone(
        zone: TargetStoreZone['zone'],
        targets: TargetStoreZone['targets'],
        distance = DEFAULT_DISTANCE
    ) {
        this.zones.add({ zone, targets, distance });
    }

    public addModels(
        models: string[] | number[] | string | number,
        targets: TargetStoreBase['targets'],
        distance = DEFAULT_DISTANCE
    ) {
        if (models instanceof Array) {
            for (const model of models) {
                this.models.add({ model: this.getId(model), targets, distance });
            }
            return;
        }

        this.models.add({ model: this.getId(models), targets, distance });
    }

    public async addEntities(
        entities: number[] | number,
        targets: TargetStoreBase['targets'],
        distance = DEFAULT_DISTANCE
    ) {
        if (entities instanceof Array) {
            for (const entity of entities) {
                this.entities.add({ entity, targets, distance });
            }
            return;
        }

        this.entities.add({ entity: entities, targets, distance });
    }

    public async addBones(bones: string[] | string, targets: TargetStoreBase['targets'], distance = DEFAULT_DISTANCE) {
        if (bones instanceof Array) {
            for (const bone of bones) {
                this.bones.add({ bone: bone, targets, distance });
            }
            return;
        }

        this.bones.add({ bone: bones, targets, distance });
    }

    public getId(id: string | number): string {
        if (typeof id === 'number') return id.toString();
        return joaat(id).toString();
    }
}

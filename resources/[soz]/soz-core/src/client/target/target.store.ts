import { Injectable } from '@core/decorators/injectable';
import { TargetStoreData } from '@public/client/target/target.store.data';
import { joaat } from '@public/shared/joaat';
import { AbstractZone } from '@public/shared/polyzone/abstract.zone';
import { TargetOption } from '@public/shared/target';

const DEFAULT_DISTANCE = 2.5;

export type TargetStoreBase = {
    targets: TargetOption[];
    distance: number;
};

type TargetStoreZone = TargetStoreBase & {
    zone: AbstractZone;
};

@Injectable()
export class TargetStore {
    public zones: TargetStoreData<TargetStoreZone> = new TargetStoreData<TargetStoreZone>();
    public models: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public peds: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public players: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public entities: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();
    public vehicles: TargetStoreData<TargetStoreBase> = new TargetStoreData<TargetStoreBase>();

    public addZone(
        id: string,
        zone: TargetStoreZone['zone'],
        targets: TargetStoreZone['targets'],
        distance = DEFAULT_DISTANCE
    ): void {
        this.zones.add(id, { zone, targets, distance });
    }

    public addModels(
        models: string[] | number[] | string | number,
        targets: TargetStoreBase['targets'],
        distance = DEFAULT_DISTANCE
    ): void {
        if (models instanceof Array) {
            for (const model of models) {
                this.models.add(this.getId(model), { targets, distance });
            }
            return;
        }

        this.models.add(this.getId(models), { targets, distance });
    }

    public addEntities(
        entities: string[] | number[] | string | number,
        targets: TargetStoreBase['targets'],
        distance = DEFAULT_DISTANCE
    ): void {
        if (entities instanceof Array) {
            for (const entity of entities) {
                this.entities.add(entity.toString(), { targets, distance });
            }
            return;
        }

        this.entities.add(entities.toString(), { targets, distance });
    }

    public getId(id: string | number): string {
        if (typeof id === 'number') return id.toString();
        return joaat(id).toString();
    }
}

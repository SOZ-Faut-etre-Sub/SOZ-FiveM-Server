import { Once, OnceStep } from '@core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryItem } from '@public/shared/inventory';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector3 } from '@public/shared/polyzone/vector';

import { Notifier } from '../notifier';

export type DnDCallback = (invItem: InventoryItem, entity: number, coords: Vector3) => Promise<boolean>;

type ZoneCbs = {
    id: string;
    zone: BoxZone<any>;
    cbs: DnDCallback[];
};

@Provider()
export class InventoryDragAndDropProvider {
    @Inject(Notifier)
    public notifier: Notifier;

    private models = new Map<number, DnDCallback[]>();
    private zones: ZoneCbs[] = [];
    private entities = new Map<number, DnDCallback[]>();

    @Exportable('DragAndDrop')
    public async dragAndDrop(entityHit: number, endCoords: Vector3, invItem: InventoryItem) {
        const hitpoint: Vector3 = endCoords;

        const entityCBs = this.entities.get(entityHit);
        if (entityCBs) {
            for (const cb of entityCBs) {
                if (await cb(invItem, entityHit, hitpoint)) {
                    return true;
                }
            }
        }

        let model = 0;
        try {
            model = GetEntityModel(entityHit);
        } catch {
            /* empty */
        }

        if (model) {
            const cbs = this.models.get(model) || [];
            for (const cb of cbs) {
                if (await cb(invItem, entityHit, hitpoint)) {
                    return true;
                }
            }
        }

        for (const zone of this.zones) {
            if (zone.zone.isPointInside(hitpoint)) {
                for (const cb of zone.cbs) {
                    if (await cb(invItem, entityHit, hitpoint)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public registerModelTarget(model: number, cbs: DnDCallback[]) {
        const currents = this.models.get(model) || [];
        for (const cb of cbs) {
            currents.push(cb);
        }

        this.models.set(model, currents);
    }

    public registerZoneTarget(id: string, zone: BoxZone<any>, cbs: DnDCallback[]) {
        this.zones.push({
            id,
            zone,
            cbs,
        });
    }

    public unregisterZoneTarget(id: string) {
        const index = this.zones.findIndex(zone => zone.id == id);
        if (index >= 0) {
            this.zones.splice(index, 1);
        }
    }

    public registerEntity(entity: number, cbs: DnDCallback[]) {
        const existing = this.entities.get(entity) || [];
        existing.push(...cbs);
        this.entities.set(entity, existing);
    }

    public unregisterEntity(entity: number) {
        this.entities.delete(entity);
    }

    @Once(OnceStep.Stop)
    public async stop() {
        this.models.clear();
        this.entities.clear();
        this.zones = [];
    }
}

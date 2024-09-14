import { Inject, Injectable } from '@core/decorators/injectable';
import { TargetStore } from '@public/client/target/target.store';
import { PolygonZone } from '@public/shared/polyzone/polygon.zone';
import { TargetOption } from '@public/shared/target';

import { BoxZone, Zone } from '../../shared/polyzone/box.zone';
import { Ped, PedFactory } from '../factory/ped.factory';
import { DnDCallback, InventoryDragAndDropProvider } from '../inventory/inventory.draganddrop.provider';

export type PedOptions = Ped & {
    spawnNow?: boolean;
    length?: number;
    width?: number;
    minusOne?: boolean;
    debugPoly?: boolean;
    target: {
        options: TargetOption[];
        distance: number;
    };
    dragAndDrop?: DnDCallback[];
};

const DEFAULT_DISTANCE = 2.5;

@Injectable()
export class TargetFactory {
    @Inject(InventoryDragAndDropProvider)
    private inventoryDragAndDropProvider: InventoryDragAndDropProvider;

    @Inject(PedFactory)
    private readonly pedFactory: PedFactory;

    @Inject(TargetStore)
    private readonly targetStore: TargetStore;

    public createForBoxZone(id: string, zone: Zone<any>, targets: TargetOption[], distance = DEFAULT_DISTANCE) {
        zone = {
            length: 1,
            width: 1,
            heading: 0,
            minZ: 0,
            maxZ: 1,
            ...zone,
        };

        this.targetStore.addZone(id, BoxZone.fromZone(zone), targets, distance);
    }

    public createForPolygoneZone(
        id: string,
        zone: PolygonZone<any>,
        targets: TargetOption[],
        distance = DEFAULT_DISTANCE
    ) {
        this.targetStore.addZone(id, zone, targets, distance);
    }

    public createForAllPlayer(targets: TargetOption[], distance = DEFAULT_DISTANCE) {
        this.targetStore.players.add('global', { targets, distance });
    }

    public async createForPed(ped: PedOptions) {
        const id = await this.pedFactory.createPedOnGrid(ped);

        const zone: Zone<any> = {
            center: [ped.coords.x, ped.coords.y, ped.coords.z],
            heading: ped.coords.w,
            width: ped.width || 0.8,
            length: ped.length || 0.8,
            minZ: ped.coords.z - 1,
            maxZ: ped.coords.z + 2,
            debugPoly: ped.debugPoly,
        };
        this.createForBoxZone(`entity_${id}`, zone, ped.target.options);
        if (ped.dragAndDrop) {
            this.inventoryDragAndDropProvider.registerZoneTarget(
                'dnd_ped_' + id,
                BoxZone.fromZone(zone),
                ped.dragAndDrop
            );
        }

        return id;
    }

    public deleteForPed(id: string) {
        this.pedFactory.deletePedOnGrid(id);
        this.removeBoxZone(`entity_${id}`);
    }

    public createForModel(
        models: string[] | number[] | string | number,
        targets: TargetOption[],
        distance = DEFAULT_DISTANCE
    ) {
        this.targetStore.addModels(models, targets, distance);
    }

    public createForEntity(
        entities: string[] | number[] | string | number,
        targets: TargetOption[],
        distance = DEFAULT_DISTANCE
    ) {
        this.targetStore.addEntities(entities, targets, distance);
    }

    public createForAllVehicle(targets: TargetOption[], distance = DEFAULT_DISTANCE) {
        this.targetStore.vehicles.add('global', { targets, distance });
    }

    public createForAllPed(targets: TargetOption[], distance = DEFAULT_DISTANCE) {
        this.targetStore.peds.add('global', { targets, distance });
    }

    public removeTargetModel(models: string[], labels: string[]) {
        for (const model of models) {
            this.targetStore.models.remove(this.targetStore.getId(model));
        }
    }

    public removeForEntity(entities: number[], labels: string[]) {
        for (const entity of entities) {
            this.targetStore.entities.remove(entity.toString());
        }
    }

    public removeBoxZone(id: string) {
        this.targetStore.zones.remove(id);
    }

    public createForBone(bones: string[] | string, targets: TargetOption[], distance = 1.5) {
        this.targetStore.addBones(bones, targets, distance);
    }
}

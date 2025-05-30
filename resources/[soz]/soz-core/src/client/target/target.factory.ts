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

    public async createForBoxZone(id: string, zone: Zone<any>, targets: TargetOption[], distance = DEFAULT_DISTANCE) {
        zone = {
            length: 1,
            width: 1,
            heading: 0,
            minZ: 0,
            maxZ: 1,
            ...zone,
        };

        await this.targetStore.addZone(id, BoxZone.fromZone(zone), targets, distance);
    }

    public async createForPolygoneZone(
        id: string,
        zone: PolygonZone<any>,
        targets: TargetOption[],
        distance = DEFAULT_DISTANCE
    ) {
        await this.targetStore.addZone(id, zone, targets, distance);
    }

    public createForAllPlayer(targets: TargetOption[], distance = DEFAULT_DISTANCE) {
        this.targetStore.players.add({ player: -1, targets, distance });
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
        return this.targetStore.addModels(models, targets, distance);
    }

    public createForEntity(
        entities: number[] | number,
        targets: TargetOption[],
        distance = DEFAULT_DISTANCE,
        id?: string
    ) {
        return this.targetStore.addEntities(entities, targets, distance, id);
    }

    public createForAllVehicle(targets: TargetOption[], distance = 3.0) {
        return this.targetStore.vehicles.add({ vehicle: -1, targets, distance });
    }

    public createForAllPed(targets: TargetOption[], distance = DEFAULT_DISTANCE) {
        return this.targetStore.peds.add({ ped: -1, targets, distance });
    }

    public removeTargetModel(models: string[]) {
        const targetsModel = this.targetStore.models.find(([, value]) =>
            models.map(m => this.targetStore.getId(m)).includes(value.model)
        );
        for (const [key] of targetsModel) {
            this.targetStore.models.remove(key);
        }
    }

    public removeForEntity(entities: number[]) {
        const targetsEntity = this.targetStore.entities.find(([, value]) => entities.includes(value.entity));
        for (const [key] of targetsEntity) {
            this.targetStore.entities.remove(key);
        }
    }

    public removeBoxZone(id: string) {
        return this.targetStore.zones.remove(id);
    }

    public async createForBone(bones: string[] | string, targets: TargetOption[], distance = 1.5) {
        return this.targetStore.addBones(bones, targets, distance);
    }
}

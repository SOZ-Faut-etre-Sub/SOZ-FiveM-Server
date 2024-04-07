import { Inject } from '@public/core/decorators/injectable';
import { WorldObject } from '@public/shared/object';
import { Vector4 } from '@public/shared/polyzone/vector';

import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { RGBAColor } from '../../shared/color';
import { BoxZone, Zone } from '../../shared/polyzone/box.zone';
import { ObjectService } from '../object/object.service';

export type ZoneDrawn = {
    zone: Zone<any>;
    id: string;
    color?: RGBAColor;
    type?: string;
    name?: string;
};

@Provider()
export class AdminZoneProvider {
    @Inject(ObjectService)
    private objectService: ObjectService;

    private zonesDrawn = new Map<string, ZoneDrawn>();
    private entityDrawn = new Map<string, number>();

    @Tick()
    public async showMenuMapperZones(): Promise<void> {
        for (const zoneDrawn of this.zonesDrawn.values()) {
            BoxZone.fromZone(zoneDrawn.zone).draw(zoneDrawn.color || [0, 255, 0, 100], 150, zoneDrawn.name);
        }
    }

    public addZoneToDraw(zone: ZoneDrawn) {
        this.zonesDrawn.set(zone.id, zone);
    }

    public removeZoneToDraw(id: string) {
        this.zonesDrawn.delete(id);
    }

    public isZoneDrawn(id: string) {
        return this.zonesDrawn.has(id);
    }

    public async addEntityToDraw(id: string, model: number, position: Vector4) {
        const initialObject: WorldObject = {
            model,
            position,
            id: id,
            placeOnGround: true,
            noCollision: true,
            invisible: false,
        };

        const objectEntity = await this.objectService.createObject(initialObject);
        SetEntityAlpha(objectEntity, 200, false);
        this.entityDrawn.set(id, objectEntity);
    }

    public async removeEntityToDraw(id: string) {
        const entity = this.entityDrawn.get(id);
        DeleteEntity(entity);
        this.entityDrawn.delete(id);
    }

    public removeTypeZoneToDraw(type: string) {
        for (const zoneDrawn of this.zonesDrawn.values()) {
            if (zoneDrawn.type === type) {
                this.zonesDrawn.delete(zoneDrawn.id);
            }
        }
    }
}

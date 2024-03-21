import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { RGBAColor } from '../../shared/color';
import { BoxZone, Zone } from '../../shared/polyzone/box.zone';

export type ZoneDrawn = {
    zone: Zone<any>;
    id: string;
    color?: RGBAColor;
    type?: string;
    name?: string;
};

@Provider()
export class AdminZoneProvider {
    private zonesDrawn = new Map<string, ZoneDrawn>();

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

    public removeTypeZoneToDraw(type: string) {
        for (const zoneDrawn of this.zonesDrawn.values()) {
            if (zoneDrawn.type === type) {
                this.zonesDrawn.delete(zoneDrawn.id);
            }
        }
    }
}

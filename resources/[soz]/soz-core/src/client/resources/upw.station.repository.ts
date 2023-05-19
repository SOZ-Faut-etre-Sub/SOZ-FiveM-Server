import { getDistance, toVector4Object, Vector3 } from '@public/shared/polyzone/vector';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { UpwCharger, UpwStation } from '../../shared/fuel';
import { RpcServerEvent } from '../../shared/rpc';
import { BlipFactory } from '../blip';

@Injectable()
export class UpwChargerRepository {
    private upwCharger: Record<number, UpwCharger> = {}; // name -> upwCharger
    private upwStation: Record<string, UpwStation> = {}; // name -> upwStation
    private displayLocation = false;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    public async load() {
        this.upwCharger = await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA, 'upwCharger');
        this.upwStation = await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA, 'upwStation');
        this.updateBlips();
    }

    public update(charger: Record<number, UpwCharger>) {
        this.upwCharger = charger;
        this.updateBlips();
    }

    private updateBlips() {
        for (const charger of Object.values(this.upwCharger)) {
            if (charger.active) {
                if (this.blipFactory.exist('job_upw_charger_' + charger.id)) {
                    this.blipFactory.remove('job_upw_charger_' + charger.id);
                }

                const station = this.upwStation[charger.station];
                if (!this.blipFactory.exist('job_upw_station_' + station.id)) {
                    this.blipFactory.create('job_upw_station_' + station.id, {
                        coords: toVector4Object(station.position),
                        name: 'Chargeur UPW',
                        sprite: 814,
                        alpha: 200,
                    });
                }
            } else {
                if (!this.blipFactory.exist('job_upw_charger_' + charger.id)) {
                    this.blipFactory.create('job_upw_charger_' + charger.id, {
                        coords: toVector4Object(charger.position),
                        name: 'Emplacement de chargeur UPW',
                        sprite: 620,
                        color: 3,
                    });
                }
                this.blipFactory.hide('job_upw_charger_' + charger.id, !this.displayLocation);
            }
        }
    }

    public get(): Record<number, UpwCharger> {
        return this.upwCharger;
    }

    public getModel(): number {
        return 2074167371;
    }

    public find(id: number): UpwCharger | undefined {
        return this.upwCharger[id];
    }

    public getClosestCharger(position: Vector3): UpwCharger | null {
        let closestCharger = null;
        let closestDistance = -1;
        Object.values(this.upwCharger).forEach(charger => {
            const distance = getDistance(position, charger.position);
            if (!closestCharger || distance < closestDistance) {
                closestCharger = charger;
                closestDistance = distance;
            }
        });
        return closestCharger;
    }

    public getStationForEntity(entity: number): string | null {
        const position = GetEntityCoords(entity) as Vector3;
        return this.getClosestCharger(position).station || null;
    }

    public getDisplayLocation() {
        return this.displayLocation;
    }

    public updateDisplayLocation(value: boolean) {
        this.displayLocation = value;
        this.updateBlips();
    }
}

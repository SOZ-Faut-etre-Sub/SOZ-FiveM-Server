import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector3 } from '@public/shared/polyzone/vector';

import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { FuelStation, FuelStationType, FuelType } from '../../shared/fuel';
import { RpcEvent } from '../../shared/rpc';

@Injectable()
export class FuelStationRepository {
    private fuelStations: Record<string, FuelStation> = {};
    private models: number[];

    public async load() {
        this.fuelStations = await emitRpc(RpcEvent.REPOSITORY_GET_DATA, 'fuelStation');
        this.models = [];
        this.updateModels();
    }

    private updateModels() {
        for (const station of Object.values(this.fuelStations)) {
            if (!this.models[station.model]) {
                this.models.push(station.model);
            }
        }
    }

    public update(garages: Record<string, FuelStation>) {
        this.fuelStations = garages;
        this.updateModels();
    }

    public get(): Record<string, FuelStation> {
        return this.fuelStations;
    }

    public find(name: string): FuelStation | undefined {
        return this.fuelStations[name];
    }

    public getModels(): number[] {
        return this.models;
    }

    public getStationForEntity(entity: number): FuelStation | null {
        const model = GetEntityModel(entity);

        const position = GetEntityCoords(entity, false) as Vector3;

        for (const stationName in this.fuelStations) {
            const station = this.fuelStations[stationName];

            if (station.entity && station.entity == entity) {
                return station;
            }

            if (station.model != model) {
                continue;
            }

            const privateOrKero = station.type === FuelStationType.Private || station.fuel === FuelType.Kerosene;

            const zone = privateOrKero
                ? new BoxZone(station.position, 2.0, 2.0, {
                      heading: station.position[3],
                      minZ: station.zone.minZ - 2.0,
                      maxZ: station.zone.maxZ + 2.0,
                  })
                : BoxZone.fromZone(station.zone);

            if (zone.isPointInside(position)) {
                return station;
            }
        }

        return null;
    }
}

import { ObjectProvider } from '@public/client/object/object.provider';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector3 } from '@public/shared/polyzone/vector';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { FuelStation, FuelStationType, FuelType } from '../../shared/fuel';
import { RpcServerEvent } from '../../shared/rpc';

const ModelMapping: Record<number, number[]> = {
    [GetHashKey('prop_gas_pump_1a')]: [GetHashKey('soz_prop_gas_pump_1a_hs2'), GetHashKey('soz_prop_gas_pump_1a_hs3')],
    [GetHashKey('prop_gas_pump_1b')]: [GetHashKey('soz_prop_gas_pump_1b_hs2'), GetHashKey('soz_prop_gas_pump_1b_hs3')],
    [GetHashKey('prop_gas_pump_1c')]: [GetHashKey('soz_prop_gas_pump_1c_hs2'), GetHashKey('soz_prop_gas_pump_1c_hs3')],
    [GetHashKey('prop_gas_pump_1d')]: [GetHashKey('soz_prop_gas_pump_1d_hs2'), GetHashKey('soz_prop_gas_pump_1d_hs3')],
    [GetHashKey('prop_gas_pump_old2')]: [
        GetHashKey('soz_prop_gas_pump_old2_hs2'),
        GetHashKey('soz_prop_gas_pump_old2_hs3'),
    ],
    [GetHashKey('prop_gas_pump_old3')]: [
        GetHashKey('soz_prop_gas_pump_old3_hs2'),
        GetHashKey('soz_prop_gas_pump_old3_hs3'),
    ],
    [GetHashKey('prop_vintage_pump')]: [
        GetHashKey('soz_prop_vintage_pump_hs2'),
        GetHashKey('soz_prop_vintage_pump_hs3'),
    ],
};

@Injectable()
export class FuelStationRepository {
    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    private fuelStations: Record<string, FuelStation> = {};
    private models: number[];

    public async load() {
        this.fuelStations = await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA, 'fuelStation');
        this.models = [];
        this.updateModels();
    }

    private updateModels() {
        for (const station of Object.values(this.fuelStations)) {
            if (!this.models.includes(station.model)) {
                this.models.push(station.model);
                if (ModelMapping[station.model]) {
                    this.models.push(ModelMapping[station.model][0]);
                }
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
        const objectId = this.objectProvider.getIdFromEntity(entity);
        const position = GetEntityCoords(entity, false) as Vector3;

        for (const stationName in this.fuelStations) {
            const station = this.fuelStations[stationName];

            if (station.objectId) {
                if (station.objectId == objectId) {
                    return station;
                } else {
                    continue;
                }
            }

            if (station.model != model && !ModelMapping[station.model].includes(model)) {
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

            station.zone.minZ -= 2.0;

            if (zone.isPointInside(position)) {
                return station;
            }
        }

        return null;
    }
}

import { Injectable } from '../../core/decorators/injectable';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';

export type ZoneOptions = {
    center: Vector3;
    length?: number;
    width?: number;
    heading?: number;
    minZ?: number;
    maxZ?: number;
    debugPoly?: boolean;
};

export type TargetOptions = {
    label: string;
    icon?: string;
    color?: string;
    type?: string;
    event?: string;
    blackoutGlobal?: boolean;
    blackoutJob?: string;
    canInteract?: (entity) => boolean;
    action?: (entity) => void;
    job?: string;
    license?: string;
    item?: string;
};

export type PedOptions = {
    spawnNow: boolean;
    model: number;
    coords: Vector4;
    minusOne: boolean;
    freeze: boolean;
    invincible: boolean;
    blockevents: boolean;
    scenario: string;
    target: {
        options: TargetOptions[];
        distance: number;
    };
};

const DEFAULT_DISTANCE = 2.5;

@Injectable()
export class TargetFactory {
    private zones: { [id: string]: any } = {};
    private players: { [id: string]: any } = {};

    public createForComboZone(id: string, zones: ZoneOptions[], targets: TargetOptions[], distance = DEFAULT_DISTANCE) {
        const boxZones = [];

        for (const [i, zone] of zones.entries()) {
            boxZones.push(exports['PolyZone'].CreateBoxZone(id + i, zone));
            this.zones[id + i] = zone;
        }

        exports['qb-target'].AddComboZone(
            boxZones,
            { name: id, debugPoly: true },
            {
                options: targets,
                distance: distance,
            }
        );
    }

    public createForBoxZone(id: string, zone: ZoneOptions, targets: TargetOptions[], distance = DEFAULT_DISTANCE) {
        zone = {
            length: 1,
            width: 1,
            heading: 0,
            minZ: 0,
            maxZ: 1,
            ...zone,
        };

        exports['qb-target'].AddBoxZone(
            id,
            { x: zone.center[0], y: zone.center[1], z: zone.center[2] },
            zone.length,
            zone.width,
            {
                debugPoly: zone.debugPoly || false,
                heading: zone.heading,
                minZ: zone.minZ,
                maxZ: zone.maxZ,
                name: id,
                debugPoly: zone.debugPoly || false,
            },
            {
                options: targets,
                distance: distance,
            }
        );

        this.zones[id] = zone;
    }

    public createForAllPlayer(targets: TargetOptions[], distance = DEFAULT_DISTANCE) {
        exports['qb-target'].AddGlobalPlayer({
            options: targets,
            distance: distance,
        });

        for (const target of targets) {
            this.players[target.label] = target;
        }
    }

    public unload() {
        for (const id of Object.keys(this.zones)) {
            exports['qb-target'].RemoveZone(id);
        }

        for (const id of Object.keys(this.players)) {
            exports['qb-target'].RemovePlayer(id);
        }
    }

    // // @TODO - Implement it when needed
    // public createWithPedSpawn(peds: PedOptions[]) {}
    //

    public createForModel(models: string[], targets: TargetOptions[], distance = DEFAULT_DISTANCE) {
        exports['qb-target'].AddTargetModel(models, {
            options: targets,
            distance: distance,
        });
    }

    // // @TODO - Implement it when needed
    // public createForAllVehicle() {}

    public removeTargetModel(models: string[], labels: string[]) {
        exports['qb-target'].RemoveTargetModel(models, labels);
    }

    // // @TODO - Implement it when needed
    // public removeTargetEntity(entities: string[], labels: string[]) {}
}

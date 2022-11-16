import { Inject, Injectable } from '../../core/decorators/injectable';
import { Zone } from '../../shared/polyzone/box.zone';
import { PedFactory } from '../factory/ped.factory';

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
    spawnNow?: boolean;
    model: string;
    coords: { x: number; y: number; z: number; w: number };
    minusOne?: boolean;
    freeze?: boolean;
    invincible?: boolean;
    blockevents?: boolean;
    scenario?: string;
    animDict?: string;
    anim?: string;
    flag?: number;
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

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    public createForBoxZone(id: string, zone: Zone, targets: TargetOptions[], distance = DEFAULT_DISTANCE) {
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

        exports['qb-target'].DeletePeds();
    }

    public async createForPed(ped: PedOptions) {
        const id = await this.pedFactory.createPed(ped);

        this.createForBoxZone(
            `entity_${id}`,
            {
                center: [ped.coords.x, ped.coords.y, ped.coords.z],
                heading: ped.coords.w,
                width: 0.8,
                length: 0.8,
                minZ: ped.coords.z - 1,
                maxZ: ped.coords.z + 2,
            },
            ped.target.options
        );
    }

    public createForModel(
        models: string[] | number[] | string | number,
        targets: TargetOptions[],
        distance = DEFAULT_DISTANCE
    ) {
        exports['qb-target'].AddTargetModel(models, {
            options: targets,
            distance: distance,
        });
    }

    public createForAllVehicle(targets: TargetOptions[], distance = DEFAULT_DISTANCE) {
        exports['qb-target'].AddGlobalVehicle({
            options: targets,
            distance: distance,
        });
    }

    public removeTargetModel(models: string[], labels: string[]) {
        exports['qb-target'].RemoveTargetModel(models, labels);
    }

    public removeBoxZone(id: string) {
        exports['qb-target'].RemoveZone(id);
    }

    // // @TODO - Implement it when needed
    // public removeTargetEntity(entities: string[], labels: string[]) {}
}

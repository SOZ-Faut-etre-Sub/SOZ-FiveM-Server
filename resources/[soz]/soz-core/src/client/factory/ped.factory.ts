import { Once, OnceStep } from '../../core/decorators/event';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { ResourceLoader } from '../resources/resource.loader';

export type Ped = {
    model: number | string;
    coords: { x: number; y: number; z: number; w: number };

    components?: { [key: number]: [number, number, number] };
    freeze?: boolean;
    invincible?: boolean;
    blockevents?: boolean;
    scenario?: string;
    animDict?: string;
    anim?: string;
    flag?: number;
};

@Injectable()
export class PedFactory {
    private peds: { [id: number]: any } = {};

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    public async createPed(ped: Ped): Promise<number> {
        const hash = typeof ped.model === 'string' ? GetHashKey(ped.model) : ped.model;

        await this.resourceLoader.loadModel(hash);

        const pedId = CreatePed(0, hash, ped.coords.x, ped.coords.y, ped.coords.z, ped.coords.w, false, false);

        SetPedDefaultComponentVariation(pedId);

        if (ped.components) {
            for (const [key, value] of Object.entries(ped.components)) {
                SetPedComponentVariation(pedId, Number(key), value[0], value[1], value[2]);
            }
        }

        if (ped.freeze) {
            FreezeEntityPosition(pedId, true);
        }

        if (ped.invincible) {
            SetEntityInvincible(pedId, true);
        }

        if (ped.blockevents) {
            SetBlockingOfNonTemporaryEvents(pedId, true);
        }

        if (ped.animDict && ped.anim) {
            await this.resourceLoader.loadAnimationDictionary(ped.animDict);
            TaskPlayAnim(pedId, ped.animDict, ped.anim, 8.0, 0, -1, ped.flag || 1, 0, false, false, false);
        }

        if (ped.scenario) {
            TaskStartScenarioInPlace(pedId, ped.scenario, 0, true);
        }

        this.peds[pedId] = true;
        return pedId;
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        for (const pedId in this.peds) {
            DeletePed(Number(pedId));
        }
        this.peds = {};
    }
}

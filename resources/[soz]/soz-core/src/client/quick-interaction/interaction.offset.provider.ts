import { Once, OnceStep } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { DoorOffset } from '@public/shared/door';

import { add2Vector3, Vector3 } from '../../shared/polyzone/vector';

@Provider()
export class InteractionOffsetProvider {
    private modelOffset = new Map<number, Vector3>();
    private modelDimensions = new Map<number, [Vector3, Vector3]>();

    private readonly defaultOffset = [0, 0, 0] as Vector3;

    public setModelOffset(entity: number, offset: Vector3) {
        this.modelOffset.set(entity, offset);
    }

    public getEntityCoordsWithOffset(entity: number): Vector3 {
        const offset = this.getEntityOffset(entity);
        return GetOffsetFromEntityInWorldCoords(entity, offset[0], offset[1], offset[2]) as Vector3;
    }

    private getEntityOffset(entity: number): Vector3 {
        if (!entity) return this.defaultOffset;
        if (GetEntityType(entity) === 0) return this.defaultOffset;

        const model = GetEntityModel(entity);
        const [minimum, maximum] = this.getModelDimensions(model);
        const offsetMode = add2Vector3(maximum, minimum);

        return this.modelOffset.get(model) || offsetMode;
    }

    private getModelDimensions(model: number): [Vector3, Vector3] {
        if (!this.modelDimensions.has(model)) {
            const [minimum, maximum] = GetModelDimensions(model) as [Vector3, Vector3];
            this.modelDimensions.set(model, [minimum, maximum]);
        }
        return this.modelDimensions.get(model);
    }

    @Once(OnceStep.Start)
    public async onServerStart() {
        for (const [model, offset] of Object.entries(DoorOffset)) {
            this.setModelOffset(Number(model), offset);
        }

        this.setModelOffset(GetHashKey('prop_ld_greenscreen_01'), [0, 0, -1]);
        this.setModelOffset(GetHashKey('v_ilev_fos_mic'), [0, 0, 1]);

        for (let i = 1; i <= 8; i++) {
            this.setModelOffset(GetHashKey(`vw_prop_casino_slot_0${i}a`), [0, -1, 1]);
        }
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        this.modelOffset.clear();
    }
}

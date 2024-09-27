import { Once, OnceStep } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { DoorOffset } from '@public/shared/door';

import { add2Vector3, Vector3 } from '../../shared/polyzone/vector';

@Provider()
export class InteractionOffsetProvider {
    private modelOffset = new Map<number, Vector3>();
    private readonly defaultOffset = [0, 0, 0] as Vector3;

    public getEntityCoordsWithOffset(entity: number): Vector3 {
        const offset = this.getEntityOffset(entity);
        return GetOffsetFromEntityInWorldCoords(entity, offset[0], offset[1], offset[2]) as Vector3;
    }

    private getEntityOffset(entity: number): Vector3 {
        if (!entity) return this.defaultOffset;
        if (GetEntityType(entity) === 0) return this.defaultOffset;

        const model = GetEntityModel(entity);
        const [minimum, maximum] = GetModelDimensions(model) as [Vector3, Vector3];
        const offsetMode = add2Vector3(maximum, minimum);

        return this.modelOffset.get(model) || offsetMode;
    }

    @Once(OnceStep.Start)
    public async onServerStart() {
        for (const [model, offset] of Object.entries(DoorOffset)) {
            this.modelOffset.set(Number(model), offset);
        }
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        this.modelOffset.clear();
    }
}

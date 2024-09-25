import { Once, OnceStep } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';

import { Vector3 } from '../../shared/polyzone/vector';

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
        return this.modelOffset.get(model) || this.defaultOffset;
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        this.modelOffset.clear();
    }
}

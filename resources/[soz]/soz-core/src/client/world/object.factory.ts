import { Once, OnceStep } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { SOZ_CORE_IS_SERVER } from '@public/globals';
import { Vector4 } from '@public/shared/polyzone/vector';

@Provider()
export class ObjectFactory {
    private objects: number[] = [];

    public create(model: number, position: Vector4, freeze: boolean): number {
        let net = false;
        if (SOZ_CORE_IS_SERVER) {
            net = true;
        }
        const entity = CreateObjectNoOffset(model, position[0], position[1], position[2], net, false, false);
        SetEntityHeading(entity, position[3]);

        if (freeze) {
            FreezeEntityPosition(entity, true);
        }

        this.objects.push(entity);

        return entity;
    }

    @Once(OnceStep.Stop)
    public stop() {
        for (const object of this.objects) {
            DeleteEntity(object);
        }
    }
}

import { Once, OnceStep } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Vector4 } from '../../shared/polyzone/vector';

@Provider()
export class ObjectFactory {
    private objects: number[] = [];

    public create(model: number, position: Vector4, freeze: boolean) {
        const entity = CreateObjectNoOffset(model, position[0], position[1], position[2], false, false, false);
        SetEntityHeading(entity, position[3]);

        if (freeze) {
            FreezeEntityPosition(entity, true);
        }

        this.objects.push(entity);
    }

    @Once(OnceStep.Stop)
    public stop() {
        for (const object of this.objects) {
            DeleteObject(object);
        }
    }
}

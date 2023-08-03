import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Logger } from '@core/logger';
import { SOZ_CORE_IS_SERVER } from '@public/globals';
import { Vector4 } from '@public/shared/polyzone/vector';

@Provider()
export class ObjectFactory {
    @Inject(Logger)
    private readonly logger: Logger;

    private objects: number[] = [];

    public create(model: number, position: Vector4, freeze: boolean): number {
        let net = false;
        if (SOZ_CORE_IS_SERVER) {
            net = true;
        }
        const entity = CreateObjectNoOffset(model, position[0], position[1], position[2], net, false, false);

        if (!entity) {
            this.logger.error(`Failed to create object ${model} at ${position[0]}, ${position[1]}, ${position[2]}`);

            return;
        }

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

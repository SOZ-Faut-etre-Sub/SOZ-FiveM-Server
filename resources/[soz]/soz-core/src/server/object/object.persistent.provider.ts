import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { WorldObject } from '../../shared/object';
import { Vector4 } from '../../shared/polyzone/vector';
import { PrismaService } from '../database/prisma.service';
import { ObjectProvider } from './object.provider';

@Provider()
export class ObjectPersistentProvider {
    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(PrismaService)
    private readonly prisma: PrismaService;

    @Once(OnceStep.DatabaseConnected)
    public async loadObjects() {
        const persistentProps = await this.prisma.persistent_prop.findMany();
        const objects: WorldObject[] = persistentProps.map(prop => {
            const position = JSON.parse(prop.position);

            return {
                id: `persistent_prop_${prop.id}`,
                model: prop.model,
                position: [position.x, position.y, position.z, position.w] as Vector4,
            };
        });

        this.objectProvider.addObjects(objects);
    }
}

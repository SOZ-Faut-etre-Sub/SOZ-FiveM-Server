import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { joaat } from '../../../shared/joaat';
import { WorldObject } from '../../../shared/object';
import { Vector4 } from '../../../shared/polyzone/vector';
import { PrismaService } from '../../database/prisma.service';
import { ObjectProvider } from '../../object/object.provider';

@Provider()
export class UpwObjectProvider {
    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(PrismaService)
    private readonly prisma: PrismaService;

    @Once(OnceStep.DatabaseConnected)
    public async loadUpwChargers() {
        const upwChargers = await this.prisma.upw_chargers.findMany({
            where: {
                active: 1,
            },
        });

        const model = joaat('upwcarcharger');

        const objects: WorldObject[] = upwChargers.map(prop => {
            const position = JSON.parse(prop.position);

            return {
                id: `upw_charger_${prop.station}_${prop.id}`,
                model,
                position: [position.x, position.y, position.z, position.w] as Vector4,
            };
        });

        this.objectProvider.addObjects(objects);
    }
}

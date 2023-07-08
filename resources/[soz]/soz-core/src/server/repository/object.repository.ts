import { Inject, Injectable } from '../../core/decorators/injectable';
import { WorldObject } from '../../shared/object';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable()
export class ObjectRepository extends Repository<WorldObject[]> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<WorldObject[]> {
        const props = await this.prismaService.persistent_prop.findMany();
        const objectList = [];

        for (const prop of props) {
            const position = JSON.parse(prop.position);

            objectList.push({
                id: prop.id,
                model: prop.model,
                position: [position.x, position.y, position.z, position.w],
                event: prop.event,
            });
        }

        return objectList;
    }
}

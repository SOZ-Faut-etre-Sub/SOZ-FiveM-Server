import { Inject, Injectable } from '../../core/decorators/injectable';
import { WorldObject } from '../../shared/object';
import { PrismaService } from '../database/prisma.service';
import { RepositoryLegacy } from './repository';

@Injectable()
export class ObjectRepository extends RepositoryLegacy<WorldObject[]> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<WorldObject[]> {
        const props = await this.prismaService.persistent_prop.findMany();
        const objectList = [];

        for (const prop of props) {
            //meteor
            if ([156, 49, 150, 155, 148, 56, 52, 59, 149].includes(Number(prop.id))) {
                continue;
            }

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

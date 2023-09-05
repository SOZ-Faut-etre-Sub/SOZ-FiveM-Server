import { Billboard } from '@public/shared/billboard';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable()
export class BillboardRepository extends Repository<Record<number, Billboard>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<Record<number, Billboard>> {
        const data = await this.prismaService.billboard.findMany();
        const billboardList: Record<number, Billboard> = {};

        for (const line of data) {
            billboardList[line.id] = {
                id: line.id,
                name: line.name,
                position: JSON.parse(line.position),
                originDictName: line.originDictName,
                originTextureName: line.originTextureName,
                imageUrl: line.imageUrl,
                previewImageUrl: line.previewImageUrl,
                templateImageUrl: line.templateImageUrl,
                width: line.width,
                height: line.height,
                lastEdit: line.lastEdit,
                lastEditor: line.lastEditor,
                enabled: line.enabled,
            };
        }

        return billboardList;
    }
}

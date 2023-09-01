import { Inject, Injectable } from '@public/core/decorators/injectable';
import { ClientEvent } from '@public/shared/event';

import { PrismaService } from '../database/prisma.service';
import { BillboardRepository } from '../repository/billboard.repository';

@Injectable()
export class BillboardService {
    @Inject(PrismaService)
    private database: PrismaService;

    @Inject(BillboardRepository)
    private billboardRepository: BillboardRepository;

    public async deleteBillboard(source: number, billboardId: number) {
        const billboardToDelete = await this.database.billboard.findFirst({
            where: {
                id: billboardId,
            },
        });

        if (billboardToDelete) {
            try {
                await this.database.billboard.delete({
                    where: {
                        id: billboardToDelete.id,
                    },
                });
                TriggerClientEvent(ClientEvent.BILLBOARD_DELETE, -1, billboardToDelete);
            } catch (error) {
                return;
            }
        }
    }

    public async updateBillboard(source: number, billboard: any) {
        const existingBillboard = await this.database.billboard.findFirst({
            where: {
                name: billboard.name,
            },
        });

        if (existingBillboard) {
            await this.database.billboard.update({
                data: {
                    name: billboard.name,
                    enabled: billboard.enabled,
                    height: billboard.height,
                    width: billboard.width,
                    imageUrl: billboard.imageUrl,
                    previewImageUrl: billboard.previewImageUrl,
                    templateImageUrl: billboard.templateImageUrl,
                    lastEditor: billboard.lastEditor,
                    originDictName: billboard.originDictName,
                    originTextureName: billboard.originTextureName,
                    position: billboard.position,
                },
                where: {
                    id: existingBillboard.id,
                },
            });
        } else {
            await this.database.billboard.create({
                data: billboard,
            });
        }

        const billboards = await this.billboardRepository.get();
        billboards[billboard.id] = billboard;

        TriggerClientEvent(ClientEvent.BILLBOARD_UPDATE, -1, billboard);
    }
}

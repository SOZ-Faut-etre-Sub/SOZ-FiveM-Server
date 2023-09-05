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

    public async updateBillboard(source: number, billboardId: number) {
        const updatedBillboard = await this.database.billboard.findUnique({
            where: {
                id: billboardId,
            },
        });

        const billboards = await this.billboardRepository.get();
        billboards[billboardId] = updatedBillboard;

        TriggerClientEvent(ClientEvent.BILLBOARD_UPDATE, -1, updatedBillboard);
    }
}

import { Inject, Injectable } from '@public/core/decorators/injectable';
import { ClothingShopID, ClothingShopItemData, GloveShopRepositoryData } from '@public/shared/shop';

import { PrismaService } from '../database/prisma.service';
import { RepositoryLegacy } from './repository';

@Injectable()
export class GloveShopRepository extends RepositoryLegacy<GloveShopRepositoryData> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<GloveShopRepositoryData> {
        const gloves = {};

        // Fetching shop items
        const shopContent = await this.prismaService.shop_content.findMany({
            where: {
                shop_id: {
                    in: [ClothingShopID.BINCO, ClothingShopID.SUBURBAN, ClothingShopID.PONSONBYS, ClothingShopID.MASK],
                },
            },
            select: {
                id: true,
                data: true,
            },
        });

        for (const content of shopContent) {
            const metadata: ClothingShopItemData = JSON.parse(content.data) as ClothingShopItemData;
            if (!metadata.correspondingDrawables) {
                continue;
            }

            gloves[content.id] = {
                id: content.id,
                correspondingDrawables: metadata.correspondingDrawables,
                texture: metadata.components[3].Texture,
            };
        }

        return gloves;
    }
}

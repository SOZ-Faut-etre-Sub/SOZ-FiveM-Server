import { Inject, Injectable } from '@public/core/decorators/injectable';
import { ClothingShopID, ClothingShopItemData, UnderTypesShopRepositoryData } from '@public/shared/shop';

import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable()
export class UnderTypesShopRepository extends Repository<UnderTypesShopRepositoryData> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<UnderTypesShopRepositoryData> {
        const repository: UnderTypesShopRepositoryData = {};

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

        // Loading items
        for (const content of shopContent) {
            const metadata: ClothingShopItemData = JSON.parse(content.data) as ClothingShopItemData;
            if (!metadata.underTypes) {
                continue;
            }

            if (metadata.underTypes.length <= 0) {
                continue;
            }

            repository[content.id] = metadata.underTypes;
        }
        return repository;
    }
}

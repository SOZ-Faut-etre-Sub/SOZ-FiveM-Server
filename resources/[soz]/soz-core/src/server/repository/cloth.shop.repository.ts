import { Inject, Injectable } from '@public/core/decorators/injectable';
import { ClothingShop, ClothingShopCategory, ClothingShopItem, ClothingShopItemData } from '@public/shared/shop';

import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

export type ClothingShopRepositoryData = {
    shops: Record<string, ClothingShop>;
    categories: Record<number, Record<number, Record<number, ClothingShopCategory>>>; // Map modelHash -> shopId -> categoryId -> category
    shopNameById: Record<number, string>;
};

@Injectable()
export class ClothingShopRepository extends Repository<ClothingShopRepositoryData> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<ClothingShopRepositoryData> {
        const repository: ClothingShopRepositoryData = {
            shops: {},
            categories: {
                [1885233650]: {
                    [1]: {},
                    [2]: {},
                    [3]: {},
                    [4]: {},
                },
                [-1667301416]: {
                    [1]: {},
                    [2]: {},
                    [3]: {},
                    [4]: {},
                },
            },
            shopNameById: {},
        };

        // Fetching shops
        const shops = await this.prismaService.shop.findMany({
            where: {
                id: {
                    in: [1, 2, 3, 4],
                },
            },
            select: {
                id: true,
                name: true,
                shop_categories: {
                    include: {
                        category: true,
                    },
                    orderBy: {
                        category: {
                            name: 'asc',
                        },
                    },
                },
            },
        });

        // Fetching shop categories
        const categories = await this.prismaService.category.findMany();

        // Fetching shop items
        const items = await this.prismaService.shop_content.findMany({
            where: {
                shop_id: {
                    in: [1, 2, 3, 4],
                },
            },
            select: {
                id: true,
                label: true,
                shop_id: true,
                category_id: true,
                price: true,
                stock: true,
                data: true,
            },
        });

        // Loading shops
        for (const shop of shops) {
            const clothingShop: ClothingShop = {
                id: shop.id,
                name: shop.name,
                categories: {},
                stocks: {},
            };
            for (const shopCategory of shop.shop_categories) {
                clothingShop.categories[shopCategory.category_id] = {
                    id: shopCategory.category_id,
                    name: shopCategory.category.name,
                    parentId: shopCategory.category.parent_id,
                };
                repository.shopNameById[shop.id] = shop.name;
                repository.shops[shop.name] = clothingShop;
            }
        }

        // Loading categories
        for (const category of categories) {
            for (const modelHash of [1885233650, -1667301416]) {
                for (const shop_id of [1, 2, 3, 4]) {
                    repository.categories[modelHash][shop_id][category.id] = {
                        id: category.id,
                        name: category.name,
                        parentId: category.parent_id,
                        content: {},
                    };
                }
            }
        }

        for (const item of items) {
            const shopItemData: ClothingShopItemData = JSON.parse(item.data) as ClothingShopItemData;
            const shopItem: ClothingShopItem = {
                id: item.id,
                shopId: item.shop_id,
                categoryId: item.category_id,
                label: item.label,
                price: item.price,
                modelHash: shopItemData.modelHash,
                components: shopItemData.components,
                props: shopItemData.props,
                correspondingDrawables: shopItemData.correspondingDrawables,
                undershirtType: shopItemData.undershirtType,
                underTypes: shopItemData.underTypes,
                modelLabel: shopItemData.modelLabel,
                colorLabel: shopItemData.colorLabel,
            };
            if (!shopItem.modelLabel) {
                continue;
            }
            const shopName = repository.shopNameById[item.shop_id];
            repository.shops[shopName].stocks[item.id] = item.stock;
            const genderToAdd = shopItem.modelHash ? [shopItem.modelHash] : [1885233650, -1667301416];
            for (const modelHash of genderToAdd) {
                if (!repository.categories[modelHash][shopItem.shopId][item.category_id].content[shopItem.modelLabel]) {
                    repository.categories[modelHash][shopItem.shopId][item.category_id].content[shopItem.modelLabel] =
                        [];
                }
                repository.categories[modelHash][shopItem.shopId][item.category_id].content[shopItem.modelLabel].push(
                    shopItem
                );
            }
        }
        return repository;
    }
}

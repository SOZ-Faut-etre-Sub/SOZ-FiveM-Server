import { Inject, Injectable } from '@public/core/decorators/injectable';
import { GlovesItem } from '@public/shared/cloth';
import { PlayerPedHash } from '@public/shared/player';
import {
    ClothingShop,
    ClothingShopCategory,
    ClothingShopID,
    ClothingShopItem,
    ClothingShopItemData,
} from '@public/shared/shop';

import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

export type ClothingShopRepositoryData = {
    shops: Record<string, ClothingShop>;
    categories: Record<number, Record<number, Record<number, ClothingShopCategory>>>; // Map modelHash -> shopId -> categoryId -> category
    shopNameById: Record<number, string>;
    underTypes: Record<number, number[]>; // Map ID -> list of compatible underTypes
    gloves: Record<number, GlovesItem>; // Map ID of gloves -> Gloves data
};

@Injectable()
export class ClothingShopRepository extends Repository<ClothingShopRepositoryData> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<ClothingShopRepositoryData> {
        const repository: ClothingShopRepositoryData = {
            shops: {},
            categories: {
                [PlayerPedHash.Male]: {
                    [ClothingShopID.BINCO]: {},
                    [ClothingShopID.SUBURBAN]: {},
                    [ClothingShopID.PONSONBYS]: {},
                    [ClothingShopID.MASK]: {},
                },
                [PlayerPedHash.Female]: {
                    [ClothingShopID.BINCO]: {},
                    [ClothingShopID.SUBURBAN]: {},
                    [ClothingShopID.PONSONBYS]: {},
                    [ClothingShopID.MASK]: {},
                },
            },
            shopNameById: {},
            underTypes: {},
            gloves: {},
        };

        // Fetching shops
        const shops = await this.prismaService.shop.findMany({
            where: {
                id: {
                    in: [ClothingShopID.BINCO, ClothingShopID.SUBURBAN, ClothingShopID.PONSONBYS, ClothingShopID.MASK],
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
                    in: [ClothingShopID.BINCO, ClothingShopID.SUBURBAN, ClothingShopID.PONSONBYS, ClothingShopID.MASK],
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
            for (const modelHash of [PlayerPedHash.Female, PlayerPedHash.Male]) {
                for (const shop_id of [
                    ClothingShopID.BINCO,
                    ClothingShopID.SUBURBAN,
                    ClothingShopID.PONSONBYS,
                    ClothingShopID.MASK,
                ]) {
                    repository.categories[modelHash][shop_id][category.id] = {
                        id: category.id,
                        name: category.name,
                        parentId: category.parent_id,
                        content: {},
                    };
                }
            }
        }

        // Loading items
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
            if (shopItem.underTypes) {
                repository.underTypes[shopItem.id] = shopItem.underTypes;
            }
            if (shopItem.correspondingDrawables) {
                repository.gloves[shopItem.id] = {
                    id: shopItem.id,
                    correspondingDrawables: shopItem.correspondingDrawables,
                    texture: shopItemData.components[3].Texture,
                };
            }
            const shopName = repository.shopNameById[item.shop_id];
            repository.shops[shopName].stocks[item.id] = item.stock;
            const genderToAdd = shopItem.modelHash ? [shopItem.modelHash] : [PlayerPedHash.Male, PlayerPedHash.Female];
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

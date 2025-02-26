import { Inject, Injectable } from '@public/core/decorators/injectable';
import { PlayerPedHash } from '@public/shared/player';
import { getRandomInt } from '@public/shared/random';
import {
    ClothingShop,
    ClothingShopID,
    ClothingShopItem,
    ClothingShopItemData,
    ClothingShopRepositoryData,
} from '@public/shared/shop';

import { ProperTorsos } from '../../config/shops';
import { Component } from '../../shared/cloth';
import { PrismaService } from '../database/prisma.service';
import { RepositoryLegacy } from './repository';

@Injectable()
export class ClothingShopRepository extends RepositoryLegacy<ClothingShopRepositoryData> {
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
            };
            for (const shopCategory of shop.shop_categories) {
                clothingShop.categories[shopCategory.category_id] = {
                    id: shopCategory.category_id,
                    name: shopCategory.category.name,
                    parentId: shopCategory.category.parent_id,
                    warmScore: shopCategory.category.warm_score,
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
                        warmScore: category.warm_score,
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
                stock: getRandomInt(0, 10), //item.stock,
            };
            if (!shopItem.modelLabel) {
                continue;
            }
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

        console.log('AAAA');

        for (const shop of Object.values(repository.categories)) {
            for (const genderContent of Object.values(Object.values(shop))) {
                for (const shopContent of Object.values(genderContent)) {
                    for (const itemModelList of Object.values(shopContent.content)) {
                        for (const item of itemModelList) {
                            if (item.components[Component.Tops] != null) {
                                try {
                                    item.components[Component.Torso] = {
                                        Drawable:
                                            ProperTorsos[item.modelHash][item.components[Component.Tops].Collection][
                                                item.components[Component.Tops].Drawable
                                            ],
                                        Texture: 0,
                                    };
                                } catch (e) {
                                    console.log(
                                        item.components[Component.Tops],
                                        ProperTorsos[item.modelHash][item.components[Component.Tops].Collection]
                                    );
                                    throw e;
                                }
                                if (!item.components[Component.Undershirt]) {
                                    item.components[Component.Undershirt] = {
                                        Drawable: item.modelHash == PlayerPedHash.Female ? 14 : 15, // This is without undershirt
                                        Texture: 0,
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }

        return repository;
    }
}

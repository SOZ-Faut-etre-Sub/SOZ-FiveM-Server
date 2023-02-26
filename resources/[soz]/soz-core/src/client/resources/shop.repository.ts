import { ProperTorsos } from '@public/config/shops';
import { ClothingShopRepositoryData } from '@public/server/repository/cloth.shop.repository';
import { Component } from '@public/shared/cloth';
import { ClothingShop, ClothingShopCategory } from '@public/shared/shop';

import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class ClothingShopRepository {
    private repoData: ClothingShopRepositoryData;

    public async load() {
        this.repoData = await emitRpc<ClothingShopRepositoryData>(RpcServerEvent.REPOSITORY_GET_DATA, 'clothingShop');

        // Hydrate tops with proper torsos and remove undershirts
        for (const shop of Object.values(this.repoData.categories)) {
            for (const genderContent of Object.values(Object.values(shop))) {
                for (const shopContent of Object.values(genderContent)) {
                    for (const item of shopContent.content) {
                        if (item.components[Component.Tops] != null) {
                            item.components[Component.Torso] = {
                                Drawable: ProperTorsos[item.modelHash][item.components[Component.Tops].Drawable],
                                Texture: 0,
                            };
                            if (item.modelHash == -1667301416) {
                                item.components[Component.Undershirt] = {
                                    Drawable: 14, // This is without undershirt (for women)
                                    Texture: 0,
                                };
                            } else {
                                item.components[Component.Undershirt] = {
                                    Drawable: 15, // This is without undershirt (for men)
                                    Texture: 0,
                                };
                            }
                        }
                    }
                }
            }
        }
    }

    public update(data: ClothingShopRepositoryData) {
        this.repoData = data;
    }

    public async updateShopStock(shop: string) {
        this.repoData.shops[shop].stocks = await emitRpc<Record<number, number>>(
            RpcServerEvent.REPOSITORY_CLOTHING_GET_STOCK,
            shop
        );
    }

    public getShop(shop: string): ClothingShop {
        return this.repoData.shops[shop];
    }

    public getFirstCategoriesOfShop(shop: string): Record<number, ClothingShopCategory> {
        return this.repoData.shops[shop].categories;
    }

    public getModelCategoriesOfShop(shop: string, modelHash: number): Record<number, ClothingShopCategory> {
        const shopId = this.repoData.shops[shop].id;
        return this.repoData.categories[modelHash][shopId];
    }

    public getShopNameById(id: number): string {
        return this.repoData.shopNameById[id];
    }
}

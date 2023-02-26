import { ProperTorsos } from '@public/config/shops';
import { ClothingShopRepositoryData } from '@public/server/repository/cloth.shop.repository';
import { Component, OutfitItem } from '@public/shared/cloth';
import { ClothingShop, ClothingShopCategory } from '@public/shared/shop';

import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { RpcEvent } from '../../shared/rpc';

@Injectable()
export class ClothingShopRepository {
    private repoData: ClothingShopRepositoryData;

    public async load() {
        this.repoData = await emitRpc<ClothingShopRepositoryData>(RpcEvent.REPOSITORY_GET_DATA, 'clothingShop');

        // Hydrate items with proper torsos
        for (const shop of Object.values(this.repoData.shops)) {
            for (const item of Object.values(shop.products)) {
                if (item.components[Component.Tops] != null) {
                    item.components[Component.Torso] = {
                        Drawable: ProperTorsos[item.modelHash][item.components[Component.Tops].Drawable],
                        Texture: 0,
                    };
                }
            }
        }
    }

    public update(data: ClothingShopRepositoryData) {
        this.repoData = data;
    }

    public async updateShopStock(shop: string) {
        this.repoData.shops[shop].stocks = await emitRpc<Record<number, number>>(
            RpcEvent.REPOSITORY_CLOTHING_GET_STOCK,
            shop
        );
    }

    public getShop(shop: string): ClothingShop {
        return this.repoData.shops[shop];
    }

    public getCategoriesOfShop(shop: string): Record<number, ClothingShopCategory> {
        return this.repoData.shops[shop].categories;
    }

    public getAllCategories(): Record<number, ClothingShopCategory> {
        return this.repoData.categories;
    }

    public getShopNameById(id: number): string {
        return this.repoData.shopNameById[id];
    }
}

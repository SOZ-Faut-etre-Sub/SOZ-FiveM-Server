import { ProperTorsos } from '@public/config/shops';
import { ClothingShopRepositoryData } from '@public/server/repository/cloth.shop.repository';
import { Component, GlovesItem } from '@public/shared/cloth';
import { PlayerPedHash } from '@public/shared/player';
import { ClothingShop, ClothingShopCategory } from '@public/shared/shop';

import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class ClothingShopRepository {
    private repoData: ClothingShopRepositoryData;

    public async load() {
        if (this.repoData) {
            return;
        }

        this.repoData = await emitRpc<ClothingShopRepositoryData>(RpcServerEvent.REPOSITORY_GET_DATA, 'clothingShop');

        // Hydrate tops with proper torsos and remove undershirts
        for (const shop of Object.values(this.repoData.categories)) {
            for (const genderContent of Object.values(Object.values(shop))) {
                for (const shopContent of Object.values(genderContent)) {
                    for (const itemModelList of Object.values(shopContent.content)) {
                        for (const item of itemModelList) {
                            if (item.components[Component.Tops] != null) {
                                item.components[Component.Torso] = {
                                    Drawable: ProperTorsos[item.modelHash][item.components[Component.Tops].Drawable],
                                    Texture: 0,
                                };
                                if (item.modelHash == PlayerPedHash.Female) {
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
    }

    public update(data: ClothingShopRepositoryData) {
        this.repoData = data;
    }

    public async updateShopStock(shop: string) {
        if (!this.repoData) {
            await this.load();
            return;
        }
        this.repoData.shops[shop].stocks = await emitRpc<Record<number, number>>(
            RpcServerEvent.REPOSITORY_CLOTHING_GET_STOCK,
            shop
        );
    }

    public getShop(shop: string): ClothingShop {
        if (!this.repoData) {
            this.load();
            return;
        }
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

    public getUnderTypes(id: number): number[] {
        return this.repoData.underTypes[id];
    }

    public getAllUnderTypes(): Record<number, number[]> {
        return this.repoData.underTypes;
    }

    public async getGloves(id: number): Promise<GlovesItem> {
        // getGloves is called by in resources\[soz]\soz-character\client\skin\apply.lua as an Exportable
        // in case soz-character is loaded before soz-core, we need to make sure the repoData is loaded before the exportable is called
        // then, simply check if repoData is loaded, and if not, load it. Meant to happen eventually at client start
        if (!this.repoData) {
            await this.load();
        }
        return this.repoData.gloves[id];
    }

    public getAllGloves(): Record<number, GlovesItem> {
        return this.repoData.gloves;
    }
}

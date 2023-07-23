import { Inject, Injectable } from '@core/decorators/injectable';
import { emitRpcTimeout } from '@core/rpc';
import { PlayerService } from '@public/client/player/player.service';
import { ProperTorsos } from '@public/config/shops';
import { Component } from '@public/shared/cloth';
import { PlayerPedHash } from '@public/shared/player';
import { ClothingShop, ClothingShopCategory, ClothingShopRepositoryData } from '@public/shared/shop';

import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class ClothingShopRepository {
    private repoData: ClothingShopRepositoryData;

    @Inject(PlayerService)
    private playerService: PlayerService;

    public async load() {
        this.repoData = await emitRpcTimeout<ClothingShopRepositoryData>(
            RpcServerEvent.REPOSITORY_CLOTHING_GET_DATA,
            10000,
            this.playerService.getPlayer().skin.Model.Hash
        );

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

    public async getShopContent(
        shop: string,
        modelHash: number
    ): Promise<{ shop: ClothingShop; content: Record<number, ClothingShopCategory> }> {
        await this.load();
        const shopId = this.repoData.shops[shop].id;

        return {
            shop: this.repoData.shops[shop],
            content: this.repoData.categories[modelHash][shopId],
        };
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
}

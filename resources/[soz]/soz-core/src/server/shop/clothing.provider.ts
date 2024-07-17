import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { Component, OutfitItem } from '@public/shared/cloth';
import { RpcServerEvent } from '@public/shared/rpc';
import { ClothingShop, ClothingShopCategory, ClothingShopRepositoryData } from '@public/shared/shop';

import { PlayerService } from '../player/player.service';
import { ClothingShopRepository } from '../repository/cloth.shop.repository';

@Provider()
export class ClothingProvider {
    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Rpc(RpcServerEvent.CLOTHING_GET_SHOP)
    public async getShopData(
        source: number,
        playerPedHash: number,
        shop: string
    ): Promise<{ shop: ClothingShop; content: Record<number, ClothingShopCategory> }> {
        const clothingData = await this.getClothingData(source, playerPedHash);

        if (!clothingData) {
            return null;
        }

        return {
            shop: clothingData.shops[shop],
            content: clothingData.categories[playerPedHash][clothingData.shops[shop].id],
        };
    }

    private async getClothingData(source: number, playerPedHash: number): Promise<ClothingShopRepositoryData> {
        const shop = await this.clothingShopRepository.get();
        if (!shop) {
            return null;
        }

        // remove categories from another ped model
        return {
            ...shop,
            categories: Object.entries(shop.categories)
                .filter(([key]) => Number(key) === playerPedHash)
                .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {}) as { [key: string]: any },
        };
    }

    @Rpc(RpcServerEvent.CLOTHING_GET_WARM_SCORE)
    public async getClothCategory(
        source: number,
        outfit: Partial<Record<Component, OutfitItem>>
    ): Promise<Partial<Record<Component, number>>> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return null;
        }

        const shop = await this.clothingShopRepository.get();
        if (!shop) {
            return null;
        }

        const ret: Partial<Record<Component, number>> = {};

        for (const compString of Object.keys(outfit)) {
            const component = Number(compString) as Component;
            if (component == Component.Torso) {
                continue;
            }

            for (const shopContent of Object.values(shop.categories[player.skin.Model.Hash])) {
                const cat = Object.values(shopContent).find(category => {
                    return !!Object.values(category.content).find(item => {
                        return item.find(
                            elem =>
                                elem.components[component] &&
                                outfit[component] &&
                                elem.components[component].Drawable == outfit[component].Drawable
                        );
                    });
                });
                if (cat) {
                    ret[component] = cat.warmScore;
                    break;
                }
            }
        }

        return ret;
    }
}

import { Inject, Injectable } from '@core/decorators/injectable';
import { emitRpcTimeout } from '@core/rpc';
import { PlayerService } from '@public/client/player/player.service';
import { ClothingShop, ClothingShopCategory } from '@public/shared/shop';

import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class ClothingShopRepository {
    @Inject(PlayerService)
    private playerService: PlayerService;

    public async getShopContent(
        shop: string
    ): Promise<{ shop: ClothingShop; content: Record<number, ClothingShopCategory> }> {
        return await emitRpcTimeout<{ shop: ClothingShop; content: Record<number, ClothingShopCategory> }>(
            RpcServerEvent.REPOSITORY_CLOTHING_GET_SHOP,
            10000,
            this.playerService.getPlayer().skin.Model.Hash,
            shop
        );
    }
}

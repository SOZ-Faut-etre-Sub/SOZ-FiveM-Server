import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Outfit } from '@public/shared/cloth';
import { RpcClientEvent } from '@public/shared/rpc';

import { ClothingService } from './clothing.service';

@Provider()
export class ClothingProvider {
    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Rpc(RpcClientEvent.CHECK_WEARING_GLOVES)
    public async checkWearingGloves(): Promise<boolean> {
        return await this.clothingService.checkWearingGloves();
    }

    @Rpc(RpcClientEvent.GET_CLOTHES)
    public async getClothes(): Promise<Outfit> {
        return await this.clothingService.getClothSet();
    }
}

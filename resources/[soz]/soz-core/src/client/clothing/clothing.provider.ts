import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Outfit } from '@public/shared/cloth';
import { PlayerPedHash } from '@public/shared/player';
import { RpcClientEvent } from '@public/shared/rpc';

import { ResourceLoader } from '../repository/resource.loader';
import { ClothingService } from './clothing.service';

@Provider()
export class ClothingProvider {
    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Rpc(RpcClientEvent.CHECK_WEARING_GLOVES)
    public async checkWearingGloves(): Promise<boolean> {
        return await this.clothingService.checkWearingGloves();
    }

    @Rpc(RpcClientEvent.GET_CLOTHES)
    public async getClothes(): Promise<Outfit> {
        return await this.clothingService.getClothSet();
    }

    @Rpc(RpcClientEvent.CLOTH_FILTER_GEN9)
    public async filterGen9(data: Record<PlayerPedHash, Record<number, number[]>>) {
        const res: Record<PlayerPedHash, Record<number, number[]>> = {};
        for (const [genderStr, comps] of Object.entries(data)) {
            const gender = parseInt(genderStr);
            let ped = PlayerPedId();
            if (GetEntityModel(ped) != gender) {
                await this.resourceLoader.loadModel(gender);
                ped = CreatePed(0, gender, 0, 0, 0, 0, false, false);
            }
            res[gender] = {};
            for (const [comp, drawables] of Object.entries(comps)) {
                res[gender][comp] = [];
                for (const drawable of drawables) {
                    if (!IsPedComponentVariationGen9Exclusive(ped, parseInt(comp), drawable)) {
                        res[gender][comp].push(drawable);
                    }
                }
            }
            if (ped != PlayerPedId()) {
                this.resourceLoader.unloadModel(gender);
                DeletePed(ped);
            }
        }
        return res;
    }

    @Rpc(RpcClientEvent.CLOTH_TEXTURE_COUNT)
    public async exturecount(gender: number, comp: number, drawable: number) {
        let ped = PlayerPedId();
        if (GetEntityModel(ped) != gender) {
            await this.resourceLoader.loadModel(gender);
            ped = CreatePed(0, gender, 0, 0, 0, 0, false, false);
        }
        const ret = GetNumberOfPedTextureVariations(ped, comp, drawable);
        if (ped != PlayerPedId()) {
            this.resourceLoader.unloadModel(gender);
            DeletePed(ped);
        }
        return ret;
    }
}

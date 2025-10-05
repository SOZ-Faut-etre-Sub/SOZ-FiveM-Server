import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Tick } from '@public/core/decorators/tick';
import { Component, Outfit } from '@public/shared/cloth';
import { PlayerPedHash } from '@public/shared/player';
import { RpcClientEvent } from '@public/shared/rpc';

import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';
import { ClothingService } from './clothing.service';

@Provider()
export class ClothingProvider {
    @Inject(ClothingService)
    private clothingService: ClothingService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private buoyancy = false;

    @Rpc(RpcClientEvent.CHECK_WEARING_GLOVES)
    public async checkWearingGloves(): Promise<boolean> {
        return this.clothingService.checkWearingGloves();
    }

    @Rpc(RpcClientEvent.GET_CLOTHES)
    public async getClothes(): Promise<Outfit> {
        return this.clothingService.getClothSet(PlayerPedId(), true);
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

    @Tick(1000)
    public lifeJackeBuoyancy() {
        const playerPed = PlayerPedId();
        const player = this.playerService.getPlayer();
        this.buoyancy = false;
        if (GetPedDrawableVariationCollectionName(playerPed, Component.BodyArmor) == 'soz_bcso') {
            const index = GetPedDrawableVariationCollectionLocalIndex(playerPed, Component.BodyArmor);
            if (player.skin.Model.Hash == PlayerPedHash.Male) {
                this.buoyancy = [16, 17].includes(index);
            } else if (player.skin.Model.Hash == PlayerPedHash.Female) {
                this.buoyancy = [19, 21].includes(index);
            }
        }
    }

    @Tick()
    public lifeJacket() {
        const playerPed = PlayerPedId();
        if (this.buoyancy && !IsPedInAnyVehicle(playerPed, false) && IsPedSwimmingUnderWater(playerPed)) {
            const coords = GetEntityCoords(playerPed);
            const [ret, h] = GetGroundZFor_3dCoord(coords[0], coords[1], coords[2], true);
            if (!ret) {
                return;
            }
            const buoyancyForce = Math.min(h - coords[2], 1.0);
            const vel = GetEntityVelocity(playerPed);
            if (vel[2] < 3) {
                SetEntityVelocity(playerPed, vel[0], vel[1], vel[2] + buoyancyForce);
            }
        }
    }
}

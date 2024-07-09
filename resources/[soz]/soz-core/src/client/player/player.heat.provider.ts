import { Provider } from '@core/decorators/provider';
import { FemaleJewelryItems, MaleJewelryItems } from '@public/config/jewelry';
import { On } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { Component, Outfit } from '@public/shared/cloth';
import { PlayerPedHash } from '@public/shared/player';
import { RpcServerEvent } from '@public/shared/rpc';

import { ClothingService } from '../clothing/clothing.service';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { Store } from '../store/store';
import { PlayerService } from './player.service';

const WarmClothCategory = [
    4, //'Manteaux',
    5, //'Sweats & Hoodies',
    9, //'Pulls',
    32, //'Hiver'
    64, //'Pulls'
];

@Provider()
export class PlayerHeatProvider {
    @Inject('Store')
    public store: Store;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(NuiDispatch)
    public nuiDispatch: NuiDispatch;

    @Inject(ClothingService)
    public clothingService: ClothingService;

    @Inject(Notifier)
    public notifier: Notifier;

    private heatDeath = false;
    private heat = false;

    @On('soz-character:Client:Cloth:Applied')
    async onClothUpdate(outfit: Outfit): Promise<void> {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        const data = await emitRpc<Partial<Record<Component, number>>>(
            RpcServerEvent.CLOTHING_GET_CATEGORY,
            outfit.Components
        );
        if (!data) {
            return;
        }

        for (const cat of Object.values(data)) {
            if (WarmClothCategory.includes(cat)) {
                this.setHeat(true);
                return;
            }
        }

        const jewels = player.skin.Model.Hash == PlayerPedHash.Male ? MaleJewelryItems : FemaleJewelryItems;
        const neckJewels = jewels['Cou'];
        const scarfs = Object.keys(neckJewels.items['Echarpes']).map(item => Number(item));
        const neckProtected = scarfs.includes(outfit.Components[neckJewels.componentId].Drawable);
        if (neckProtected) {
            this.setHeat(true);
            return;
        }

        const hatJewels = jewels['Chapeaux'];
        const bonnets = Object.keys(hatJewels.items['Bonnets']).map(item => Number(item));
        const headProtected = bonnets.includes(outfit.Props[hatJewels.propId]?.Drawable) || data[Component.Mask] == 39;
        if (headProtected) {
            this.setHeat(true);
            return;
        }

        this.setHeat(false);
    }

    private setHeat(heat: boolean) {
        if (!this.heat && heat) {
            this.notifier.notify('Vous commencez à transpirer due à la forte chaleur', 'warning');
        }

        this.heat = heat;
        this.nuiDispatch.dispatch('cold', 'heat', heat);
    }

    @Tick(10_000)
    public onHeatTick() {
        this.nuiDispatch.dispatch('cold', 'heat', this.heat);
        if (!this.heat) {
            return;
        }
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (player.metadata.isdead) {
            return;
        }

        const playerPed = PlayerPedId();
        const newHealth = GetEntityHealth(playerPed) - 1;
        this.heatDeath = newHealth <= 100;
        SetEntityHealth(playerPed, newHealth);
    }

    public isHeatDeath() {
        return this.heatDeath;
    }
}

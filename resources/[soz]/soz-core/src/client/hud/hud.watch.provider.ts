import { PlayerUpdate } from '@public/core/decorators/player';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class HudWatchProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    private _haveWatch = false;

    public get haveWatch(): boolean {
        return this._haveWatch;
    }

    @PlayerUpdate()
    async onPlayerUpdate(): Promise<void> {
        this._haveWatch = this.inventoryManager.hasEnoughItem('watch', 1, true);
        this.nuiDispatch.dispatch('hud', 'UpdateHasWatch', this._haveWatch);
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'UpdateHasWatch', this._haveWatch);
    }
}

import { PlayerUpdate } from '@public/core/decorators/player';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { HudCompass } from '../../shared/hud';
import { Vector3 } from '../../shared/polyzone/vector';
import { InventoryManager } from '../inventory/inventory.manager';
import { NuiDispatch } from '../nui/nui.dispatch';
import { HudStateProvider } from './hud.state.provider';

const degreesToCardinal = (degrees: number): HudCompass['cardinal'] => {
    const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as HudCompass['cardinal'][];
    const index = Math.round(degrees / 45);
    return cardinals[index % 8];
};

@Provider()
export class HudCompassProvider {
    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject(HudStateProvider)
    private readonly hudStateProvider: HudStateProvider;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private _haveCompass = false;

    public get haveCompass(): boolean {
        return this._haveCompass;
    }

    @PlayerUpdate()
    async onPlayerUpdate(): Promise<void> {
        this._haveCompass =
            this.inventoryManager.hasEnoughItem('compass', 1, true) ||
            this.inventoryManager.hasEnoughItem('halloween_atomic_compass', 1, true);

        this.nuiDispatch.dispatch('hud', 'UpdateHasCompass', this._haveCompass);
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'UpdateHasCompass', this._haveCompass);
    }

    @Tick()
    public showCompassLoop(): void {
        if (!this.hudStateProvider.isComputedHudVisible) {
            return;
        }

        if (!this.haveCompass) {
            return;
        }

        const rotation = GetGameplayCamRot(0) as Vector3;
        const heading = 360 - ((Math.round(rotation[2]) + 360) % 360);

        this.nuiDispatch.dispatch('hud', 'UpdateCompass', {
            degree: heading,
            cardinal: degreesToCardinal(heading),
        });
    }
}

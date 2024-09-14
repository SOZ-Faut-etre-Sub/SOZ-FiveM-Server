import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../core/decorators/injectable';
import { Tick } from '../../core/decorators/tick';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class HudPlayerProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Tick()
    public async staminaUpdate() {
        const playerId = PlayerId();
        const playerStaminaUsage = Math.trunc(GetPlayerSprintStaminaRemaining(playerId));

        this.nuiDispatch.dispatch('hud', 'SetStamina', 100 - playerStaminaUsage);
    }
}

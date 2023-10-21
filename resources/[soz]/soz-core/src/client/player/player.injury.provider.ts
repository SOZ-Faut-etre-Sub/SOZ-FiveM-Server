import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { wait } from '@public/core/utils';

import { Notifier } from '../notifier';
import { PlayerService } from './player.service';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';

const CRITICAL_HEALTH = 120;

function setStealthKills(enabled: boolean) {
    const stealthKills = [
        'ACT_stealth_kill_a',
        'ACT_stealth_kill_weapon',
        'ACT_stealth_kill_b',
        'ACT_stealth_kill_c',
        'ACT_stealth_kill_d',
        'ACT_stealth_kill_a_gardener',
    ];
    for (const stealthKill of stealthKills) {
        RemoveStealthKill(GetHashKey(stealthKill), enabled);
    }
}

@Provider()
export class PlayerInjuryProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    private criticalHealthNotification = false;

    @Tick(TickInterval.EVERY_FRAME)
    async injuryLoop(): Promise<void> {
        const player = this.playerService.getPlayer();
        const ped = PlayerPedId();

        if (player === null || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

        if (GetEntityHealth(ped) > CRITICAL_HEALTH) {
            if (this.criticalHealthNotification) {
                setStealthKills(true);
                await this.playerWalkstyleProvider.updateWalkStyle('injury', null);
            }
            this.criticalHealthNotification = false;

            await wait(500);
            return;
        }

        if (IsPedInMeleeCombat(ped)) {
            SetPedToRagdoll(ped, 1000, 1000, 0, false, false, false);
        }

        DisableControlAction(0, 21, true); // disable sprint
        DisableControlAction(0, 22, true); // Jump

        if (!this.criticalHealthNotification) {
            setStealthKills(false);
            this.notifier.notify('Vous avez ~r~besoin~s~ de soins !', 'info');
            this.criticalHealthNotification = true;

            await this.playerWalkstyleProvider.updateWalkStyle('injury', 'move_injured_generic');
        }
    }
}

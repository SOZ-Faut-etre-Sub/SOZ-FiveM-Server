import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { GamesProvider } from '@public/client/games/games.provider';
import { wait } from '@public/core/utils';
import { CRITICAL_HEALTH } from '@public/shared/health';

import { Notifier } from '../notifier';
import { PlayerService } from './player.service';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';
import { PlayerZombieProvider } from './player.zombie.provider';

function setStealthKills(enabled: boolean) {
    const stealthKills = [
        'ACT_stealth_kill_a',
        'ACT_stealth_kill_weapon',
        'ACT_stealth_kill_b',
        'ACT_stealth_kill_c',
        'ACT_stealth_kill_d',
        'ACT_stealth_kill_a_gardener',
        'ACT_takedown_front_a',
        'ACT_takedown_front_b',
        'ACT_takedown_front_c',
        'ACT_takedown_front_d',
        'ACT_takedown_front_e',
        'ACT_takedown_front_f',
        'ACT_takedown_front_g',
        'ACT_takedown_front_h',
        'ACT_takedown_front_knife_a',
        'ACT_takedown_front_knife_b',
        'ACT_takedown_front_knife_c',
        'ACT_takedown_front_armed_long',
        'ACT_takedown_front_armed_short',
        'ACT_takedown_front_armed_long_vs_ai',
        'ACT_takedown_front_armed_short_vs_ai',
        'ACT_takedown_rear_a',
        'ACT_takedown_rear_b',
        'ACT_takedown_rear_c',
        'ACT_takedown_rear_knife_a',
        'ACT_takedown_rear_knife_b',
        'ACT_takedown_rear_knife_c',
        'ACT_takedown_rear_armed_long',
        'ACT_takedown_rear_armed_short',
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

    @Inject(PlayerZombieProvider)
    private playerZombieProvider: PlayerZombieProvider;

    @Inject(GamesProvider)
    private readonly gamesProvider: GamesProvider;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    private criticalHealthNotification = false;

    @Tick(TickInterval.EVERY_FRAME)
    async injuryLoop(): Promise<void> {
        const player = this.playerService.getPlayer();
        const ped = PlayerPedId();

        if (!player || player.metadata?.godmode || player.metadata?.isdead) {
            return;
        }

        if (this.playerZombieProvider.isZombie()) {
            return;
        }

        if (this.gamesProvider.areAnyGameRunning()) {
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

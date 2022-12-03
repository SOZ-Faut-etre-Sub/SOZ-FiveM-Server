import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { Notifier } from '../notifier';
import { PlayerService } from './player.service';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';

const CRITICAL_HEALTH = 40;

@Provider()
export class PlayerInjuryProvider {
    private criticalHealthNotification = false;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Tick(TickInterval.EVERY_FRAME)
    async injuryLoop(): Promise<void> {
        const player = this.playerService.getPlayer();
        const ped = PlayerPedId();

        if (player === null || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

        if (GetEntityHealth(ped) > CRITICAL_HEALTH) {
            this.criticalHealthNotification = false;
            return;
        }

        if (IsPedInMeleeCombat(ped)) {
            SetPedToRagdoll(ped, 1000, 1000, 0, false, false, false);
        }

        DisableControlAction(0, 21, true); // disable sprint
        DisableControlAction(0, 22, true); // Jump

        await this.playerWalkstyleProvider.applyWalkStyle('move_injured_generic');

        if (!this.criticalHealthNotification) {
            this.notifier.notify('Vous avez ~r~besoin~s~ de soins !', 'info');
            this.criticalHealthNotification = true;
        }
    }
}

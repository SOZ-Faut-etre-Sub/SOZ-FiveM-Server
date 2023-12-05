import { On } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { Control } from '@public/shared/input';

import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';
import { PlayerWalkstyleProvider } from '../player/player.walkstyle.provider';

@Provider()
export class InventoryOverloadProvider {
    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    private overloaded = false;
    private interval: NodeJS.Timer;

    @On('inventory:client:overloaded')
    public onOverload(overloaded: boolean) {
        this.overloaded = overloaded;
        this.playerWalkstyleProvider.updateWalkStyle('overloaded', overloaded ? 'move_heist_lester' : null);
        clearInterval(this.interval);
        if (this.overloaded) {
            this.interval = setInterval(
                () =>
                    this.notifier.notify(
                        'Tu as mal au dos ! Ouille, ouille ouille ! Débarrasse toi des objets en trop.',
                        'warning'
                    ),
                60000
            );
        }
    }

    @Tick()
    public onOverloadedTick() {
        if (this.overloaded) {
            DisableControlAction(0, Control.Jump, true);
            DisableControlAction(0, Control.Sprint, true);
            DisableControlAction(0, Control.Duck, true);
        }
    }
}

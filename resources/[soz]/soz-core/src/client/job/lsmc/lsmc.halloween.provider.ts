import { Once } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { InputService } from '../../nui/input.service';
import { NuiDispatch } from '../../nui/nui.dispatch';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class LSMCHalloweenProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(InputService)
    private inputService: InputService;

    public doLoot(entity: number) {
        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

        TriggerServerEvent(ServerEvent.LSMC_HALLOWEEN_LOOT_PLAYER, target);
    }

    @Once()
    public onStart() {
        if (!isFeatureEnabled(Feature.Halloween)) {
            return;
        }

        this.targetFactory.createForAllPlayer([
            {
                label: 'Un fil qui dépasse...',
                color: 'lsmc',
                job: 'lsmc',
                canInteract: () => {
                    return this.playerService.isOnDuty();
                },
                action: this.doLoot.bind(this),
            },
        ]);
    }
}

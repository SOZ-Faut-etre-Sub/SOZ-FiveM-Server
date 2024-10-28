import { JobType } from '@public/shared/job';

import { Once } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature } from '../../../shared/features';
import { FeatureProvider } from '../../feature/feature.provider';
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

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    public doLoot(entity: number) {
        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

        TriggerServerEvent(ServerEvent.LSMC_HALLOWEEN_LOOT_PLAYER, target);
    }

    @Once()
    public onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            return;
        }

        this.targetFactory.createForAllPlayer([
            {
                label: 'Un fil qui dépasse...',
                job: JobType.LSMC,
                category: 'society',
                action: this.doLoot.bind(this),
            },
        ]);
    }
}

import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { emitRpc } from '@public/core/rpc';
import { CraftsList } from '@public/shared/craft/craft';
import { JobType } from '@public/shared/job';
import { RpcServerEvent } from '@public/shared/rpc';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { CraftZones } from '../../../shared/job/food';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';

@Provider()
export class FoodCraftProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(JobService)
    private jobService: JobService;

    @Once(OnceStep.PlayerLoaded)
    public setupFoodCraft() {
        CraftZones.forEach(zone => {
            this.targetFactory.createForBoxZone(zone.name, zone, [
                {
                    label: 'Transformer',
                    blackoutGlobal: true,
                    blackoutJob: JobType.Food,
                    icon: 'c:/food/chef.png',
                    color: JobType.Food,
                    job: JobType.Food,
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    action: async () => {
                        const crafting = await emitRpc<CraftsList>(RpcServerEvent.CRAFT_GET_RECIPES, JobType.Food);
                        crafting.title = this.jobService.getJob(JobType.Food).label;
                        crafting.subtitle = 'Transformation';
                        this.nuiDispatch.dispatch('craft', 'ShowCraft', crafting);
                    },
                },
            ]);
        });
    }
}

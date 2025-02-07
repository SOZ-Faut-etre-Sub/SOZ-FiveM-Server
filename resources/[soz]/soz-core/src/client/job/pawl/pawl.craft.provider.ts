import { CraftService } from '@public/client/craft/craft.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { JobType } from '@public/shared/job';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { CraftZones } from '../../../shared/job/pawl';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';

@Provider()
export class PawlCraftProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(CraftService)
    private craftService: CraftService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(JobService)
    private jobService: JobService;

    @Once(OnceStep.PlayerLoaded)
    public setupPawlCraft() {
        this.craftService.createBtargetZoneCraft(CraftZones, 'pawl/start-prod', 'Fabriquer', JobType.Pawl);
    }
}

import { CraftService } from '@public/client/craft/craft.service';
import { JobType } from '@public/shared/job';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { baunCraftZones } from '../../../shared/job/baun';

@Provider()
export class BaunCraftProvider {
    @Inject(CraftService)
    private craftService: CraftService;

    @Once(OnceStep.PlayerLoaded)
    public setupBaunCraftZone() {
        this.craftService.createBtargetZoneCraft(baunCraftZones, 'c:/baun/craft.png', 'Confectionner', JobType.Baun);
    }
}

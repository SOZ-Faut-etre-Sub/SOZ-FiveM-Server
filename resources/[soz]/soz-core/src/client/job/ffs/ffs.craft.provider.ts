import { CraftService } from '@public/client/craft/craft.service';
import { JobType } from '@public/shared/job';
import { FFSCraftZones } from '@public/shared/job/ffs';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';

@Provider()
export class FightForStyleCraftProvider {
    @Inject(CraftService)
    private craftService: CraftService;

    @Once(OnceStep.PlayerLoaded)
    public setupFfsJobCraft() {
        this.craftService.createBtargetZoneCraft(FFSCraftZones, 'c:/ffs/craft.png', 'Confectionner', JobType.Ffs);
    }
}

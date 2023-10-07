import { CraftService } from '@public/client/craft/craft.service';
import { JobType } from '@public/shared/job';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { CraftZones } from '../../../shared/job/food';

@Provider()
export class FoodCraftProvider {
    @Inject(CraftService)
    private craftService: CraftService;

    @Once(OnceStep.PlayerLoaded)
    public setupFoodCraft() {
        this.craftService.createBtargetZoneCraft(CraftZones, 'c:/food/chef.png', 'Transformer', JobType.Food);
    }
}

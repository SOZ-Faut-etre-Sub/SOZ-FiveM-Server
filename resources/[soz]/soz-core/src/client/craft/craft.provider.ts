import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpcTimeout } from '@public/core/rpc';
import { Crafts, CraftsList } from '@public/shared/craft/craft';
import { NuiEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

import { ProgressService } from '../progress.service';

@Provider()
export class CraftProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnNuiEvent(NuiEvent.CraftDoRecipe)
    public async onDoCraft({
        itemId,
        category,
        type,
    }: {
        itemId: string;
        category: string;
        type: string;
    }): Promise<CraftsList> {
        const crafts = Crafts[type];
        const categoryList = crafts[category];
        return await emitRpcTimeout<CraftsList>(
            RpcServerEvent.CRAFT_DO_RECIPES,
            categoryList.duration + 2000,
            itemId,
            type,
            category
        );
    }

    @OnNuiEvent(NuiEvent.CraftCancel)
    public async onCancel(): Promise<void> {
        this.progressService.cancel();
    }
}

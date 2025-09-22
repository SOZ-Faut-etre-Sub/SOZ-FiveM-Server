import { GangProvider } from '@private/client/gang/gang.provider';
import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpcTimeout } from '@public/core/rpc';
import { CraftCategory, Crafts, CraftsList } from '@public/shared/craft/craft';
import { NuiEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

import { ProgressService } from '../progress.service';

@Provider()
export class CraftProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(GangProvider)
    private gangProvider: GangProvider;

    private getCrafts(type: string): Record<string, CraftCategory> {
        if (type == 'gang') {
            return this.gangProvider.getGangRecipes();
        }

        return Crafts[type];
    }

    @OnNuiEvent(NuiEvent.CraftDoRecipe)
    public async onDoCraft({
        craftId,
        category,
        type,
    }: {
        craftId: string;
        category: string;
        type: string;
    }): Promise<CraftsList> {
        const crafts = this.getCrafts(type);
        const categoryList = crafts[category];
        return await emitRpcTimeout<CraftsList>(
            RpcServerEvent.CRAFT_DO_RECIPES,
            categoryList.duration + 2000,
            craftId,
            type,
            category
        );
    }

    @OnNuiEvent(NuiEvent.CraftCancel)
    public async onCancel(): Promise<void> {
        this.progressService.cancel();
    }
}

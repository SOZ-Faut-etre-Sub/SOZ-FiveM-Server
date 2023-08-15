import { Command } from '@public/core/decorators/command';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { BillboardRepository } from '../resources/billboard.repository';

@Provider()
export class BillboardProvider {
    @Inject(BillboardRepository)
    private billboardRepository: BillboardRepository;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoriesLoaded() {
        const billboards = this.billboardRepository.get();
        for (const billboard of Object.values(billboards)) {
            if (!billboard.enabled) {
                continue;
            }

            console.log(billboard);
        }
    }

    @Command('billboard')
    public init(_, url) {
        const dict = CreateRuntimeTxd('billboard_triptyque');
        const dui = CreateDui(url, 1024, 1024);
        const duiHandle = GetDuiHandle(dui);
        const runtime = CreateRuntimeTextureFromDuiHandle(dict, 'triptyque2', duiHandle);
        console.log('INIT DONE', runtime, duiHandle, dui, dict);
        RemoveReplaceTexture('soz_billboards_txd', 'triptyque');
        AddReplaceTexture('soz_billboards_txd', 'triptyque', 'billboard_triptyque', 'triptyque2');
    }

    @Command('billboard-clear')
    public clear() {
        RemoveReplaceTexture('soz_billboards_txd', 'triptyque');
    }
}

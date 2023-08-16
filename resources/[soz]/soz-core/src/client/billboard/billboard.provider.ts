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
            this.loadBillboards(
                billboard.imageUrl,
                billboard.originDictName,
                billboard.originTextureName,
                billboard.width,
                billboard.height,
                billboard.name
            );
        }
    }

    public loadBillboards(
        imageUrl: string,
        dictName: string,
        textureName: string,
        width: number,
        height: number,
        name: string
    ) {
        const dict = CreateRuntimeTxd(name);
        const dui = CreateDui(imageUrl, width, height);
        const duiHandle = GetDuiHandle(dui);
        CreateRuntimeTextureFromDuiHandle(dict, `${name}_texture`, duiHandle);
        RemoveReplaceTexture(dictName, textureName);
        AddReplaceTexture(dictName, textureName, name, `${name}_texture`);
    }

    @Command('billboard-clear')
    public clear(_, name) {
        RemoveReplaceTexture('soz_billboards_txd', name);
    }
}

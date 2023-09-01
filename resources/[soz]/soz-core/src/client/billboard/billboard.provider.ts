import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';

import { BillboardRepository } from '../resources/billboard.repository';
import { BillboardService } from './billboard.service';

@Provider()
export class BillboardProvider {
    @Inject(BillboardRepository)
    private billboardRepository: BillboardRepository;

    @Inject(BillboardService)
    private billboardService: BillboardService;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoriesLoaded() {
        //Billboards : Attente du chargement de l'ensemble des ressources
        await wait(15000);

        const billboards = this.billboardRepository.get();
        for (const billboard of Object.values(billboards)) {
            if (!billboard.enabled) {
                continue;
            }
            this.billboardService.loadBillboard(
                billboard.imageUrl,
                billboard.originDictName,
                billboard.originTextureName,
                billboard.width,
                billboard.height,
                billboard.name
            );
            await wait(0);
        }
    }

    @OnEvent(ClientEvent.BILLBOARD_UPDATE)
    public async updateBillboard(billboard) {
        this.billboardRepository.updateBillboard(billboard);

        if (!billboard.enabled) {
            this.deleteBillboard(billboard);
            return;
        }

        this.billboardService.loadBillboard(
            billboard.imageUrl,
            billboard.originDictName,
            billboard.originTextureName,
            billboard.width,
            billboard.height,
            billboard.name
        );
    }

    @OnEvent(ClientEvent.BILLBOARD_DELETE)
    public async deleteBillboard(billboard) {
        if (!billboard || !billboard.id) {
            return;
        }
        this.billboardRepository.deleteBillboard(billboard.id);
        RemoveReplaceTexture(billboard.originDictName, billboard.originTextureName);
    }
}

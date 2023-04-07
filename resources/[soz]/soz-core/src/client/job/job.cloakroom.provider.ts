import { Component, WardrobeConfig } from '@public/shared/cloth';
import { JobType } from '@public/shared/job';
import { BaunCloakroom } from '@public/shared/job/baun';
import { NewGarrayCloakroom } from '@public/shared/job/bennys';
import { CjrCloakroom } from '@public/shared/job/cjr';
import { FfsCloakroom } from '@public/shared/job/ffs';
import { FoodCloakroom } from '@public/shared/job/food';
import { GarbageCloakroom } from '@public/shared/job/garbage';
import { HAZMAT_OUTFIT_NAME, LsmcCloakroom } from '@public/shared/job/lsmc';
import { NewsCloakroom } from '@public/shared/job/news';
import { OilCloakroom } from '@public/shared/job/oil';
import { PawlCloakroom } from '@public/shared/job/pawl';
import { StonkCloakroom } from '@public/shared/job/stonk';
import { UpwCloakroom } from '@public/shared/job/upw';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { PlayerWardrobe } from '../player/player.wardrobe';
import { ProgressService } from '../progress.service';

const jobStorage: Partial<Record<JobType, WardrobeConfig>> = {
    upw: UpwCloakroom,
    taxi: CjrCloakroom,
    pawl: PawlCloakroom,
    baun: BaunCloakroom,
    oil: OilCloakroom,
    news: NewsCloakroom,
    garbage: GarbageCloakroom,
    food: FoodCloakroom,
    ffs: FfsCloakroom,
    ['cash-transfer']: StonkCloakroom,
    bennys: NewGarrayCloakroom,
    lsmc: LsmcCloakroom,
};

@Provider()
export class JobCloakroomProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @OnEvent(ClientEvent.JOBS_CHECK_CLOAKROOM_STORAGE)
    public async onCheckCloakroomStorage(storageId: string) {
        const { completed } = await this.progressService.progress(
            'check-cloakroom',
            'Vérification du vestiaire',
            5000,
            {
                name: 'think_01_amy_skater_01',
                dictionary: 'anim@amb@board_room@whiteboard@',
                flags: 1,
            }
        );
        if (!completed) {
            return;
        }
        const result = await emitRpc(RpcServerEvent.INVENTORY_SEARCH, storageId, 'work_clothes');
        if (!result) {
            this.notifier.notify(`Il n'y a pas de tenue de travail dans le vestiaire.`, 'error');
            return;
        }
        this.notifier.notify(`Il reste ${result} tenues de travail dans le vestiaire.`);
    }

    public async openCloakroom(storageIdToSave: string, config: WardrobeConfig, customLabel?: string) {
        const outfitSelection = await this.playerWardrobe.selectOutfit(config, 'Tenue civile', customLabel);

        if (outfitSelection.canceled) {
            return;
        }

        if (
            outfitSelection.outfit &&
            storageIdToSave &&
            !(await emitRpc<boolean>(RpcServerEvent.JOBS_USE_WORK_CLOTHES, storageIdToSave))
        ) {
            this.notifier.notify("Il n'y a pas de tenue de travail dans le vestiaire.", 'error');
            return;
        }

        const progress = await this.playerWardrobe.waitProgress(false);

        if (!progress.completed) {
            return;
        }

        if (outfitSelection.outfit) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfitSelection.outfit);

            const ped = PlayerPedId();
            let hazmat = true;
            for (const [componentkey, item] of Object.entries(
                LsmcCloakroom[GetEntityModel(ped)][HAZMAT_OUTFIT_NAME].Components
            )) {
                const component = Number(componentkey) as Component;
                if (
                    !outfitSelection.outfit.Components[component] ||
                    outfitSelection.outfit.Components[component].Drawable != item.Drawable
                ) {
                    hazmat = false;
                    break;
                }
            }
            TriggerServerEvent('lsmc:server:SetHazmat', hazmat);
        } else {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
        }
    }

    @OnEvent(ClientEvent.JOB_OPEN_CLOAKROOM)
    public async openJobCloakroom(storageIdToSave: string, job: string) {
        await this.openCloakroom(storageIdToSave, jobStorage[job]);
    }
}

import { SWAT_CLOAKROOM } from '@private/shared/police';
import { Component, WardrobeConfig } from '@public/shared/cloth';
import { JobType } from '@public/shared/job';
import { BaunCloakroom } from '@public/shared/job/baun';
import { NewGarrayCloakroom } from '@public/shared/job/bennys';
import { CjrCloakroom } from '@public/shared/job/cjr';
import { DmcCloakroom } from '@public/shared/job/dmc';
import { FDFCloakroom } from '@public/shared/job/fdf';
import { FfsCloakroom } from '@public/shared/job/ffs';
import { FoodCloakroom } from '@public/shared/job/food';
import { GarbageCloakroom } from '@public/shared/job/garbage';
import { GouvCloakroom } from '@public/shared/job/gouv';
import { LsmcCloakroom } from '@public/shared/job/lsmc';
import { NewsCloakroom, YouNewsCloakroom } from '@public/shared/job/news';
import { OilCloakroom } from '@public/shared/job/oil';
import { PawlCloakroom } from '@public/shared/job/pawl';
import { StonkCloakroom } from '@public/shared/job/stonk';
import { UpwCloakroom } from '@public/shared/job/upw';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { ServerEvent } from '../../shared/event';
import { POLICE_CLOAKROOM, POLICE_CUSTOM_CLOAKROOM, RankOutfit } from '../../shared/job/police';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { PlayerWardrobe } from '../player/player.wardrobe';
import { ProgressService } from '../progress.service';

const jobStorage: Partial<Record<JobType, WardrobeConfig>> = {
    [JobType.Upw]: UpwCloakroom,
    [JobType.Taxi]: CjrCloakroom,
    [JobType.Pawl]: PawlCloakroom,
    [JobType.Baun]: BaunCloakroom,
    [JobType.Oil]: OilCloakroom,
    [JobType.News]: NewsCloakroom,
    [JobType.YouNews]: YouNewsCloakroom,
    [JobType.Garbage]: GarbageCloakroom,
    [JobType.Food]: FoodCloakroom,
    [JobType.Ffs]: FfsCloakroom,
    [JobType.CashTransfer]: StonkCloakroom,
    [JobType.Bennys]: NewGarrayCloakroom,
    [JobType.LSMC]: LsmcCloakroom,
    [JobType.Gouv]: GouvCloakroom,
    [JobType.FDF]: FDFCloakroom,
    [JobType.DMC]: DmcCloakroom,
};

@Provider()
export class JobCloakroomProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    public async checkCloakroomStorage(storageId: string) {
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

        const result = await emitRpc<number>(RpcServerEvent.INVENTORY_GET_ITEM_COUNT, storageId, 'work_clothes');

        if (result <= 0) {
            this.notifier.notify(`Il n'y a pas de tenue de travail dans le vestiaire.`, 'error');
            return;
        }

        this.notifier.notify(`Il reste ${result} tenues de travail dans le vestiaire.`);
    }

    public async openCloakroom(storageIdToSave: string, config: WardrobeConfig, allowCustom?: boolean) {
        if (!config) {
            return;
        }

        const outfitSelection = await this.playerWardrobe.selectOutfit(config, 'Tenue civile', allowCustom);

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
        } else {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
        }
    }

    public async openJobCloakroom(storageIdToSave: string, job: JobType) {
        const player = this.playerService.getPlayer();
        const model = GetEntityModel(PlayerPedId());

        if (POLICE_CLOAKROOM[player.job.id]) {
            const configs = POLICE_CLOAKROOM[player.job.id];

            if (RankOutfit[player.job.id] && RankOutfit[player.job.id][model]) {
                for (const outfitName of Object.keys(configs[model])) {
                    const outfit = configs[model][outfitName];
                    if (outfit.rankType) {
                        outfit.Components[Component.Decals] = { Drawable: 0, Texture: 0, Palette: 0 };
                        if (
                            RankOutfit[player.job.id][model][outfit.rankType] &&
                            RankOutfit[player.job.id][model][outfit.rankType][player.job.grade]
                        ) {
                            outfit.Components[Component.Decals] = {
                                Drawable: RankOutfit[player.job.id][model][outfit.rankType][player.job.grade][0],
                                Texture: RankOutfit[player.job.id][model][outfit.rankType][player.job.grade][1],
                                Palette: 0,
                                Collection: 'soz_bcso',
                            };
                        } else {
                            outfit.Components[Component.Decals] = {
                                Drawable: 0,
                                Texture: 0,
                                Palette: 0,
                            };
                        }
                    }
                }
            }

            for (const outfitName of Object.keys(SWAT_CLOAKROOM[model])) {
                if (SWAT_CLOAKROOM[model][outfitName]) {
                    configs[model][outfitName] = SWAT_CLOAKROOM[model][outfitName];
                }
            }

            return await this.openCloakroom(storageIdToSave, configs, !!POLICE_CUSTOM_CLOAKROOM[player.job.id]);
        }

        await this.openCloakroom(storageIdToSave, jobStorage[job]);
    }
}

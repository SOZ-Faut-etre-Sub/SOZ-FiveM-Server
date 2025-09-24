import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { billboardOffsets } from '@public/shared/billboard';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobPermission } from '@public/shared/job';
import { HttpLinkValidator } from '@public/shared/nui/input';

import { JobService } from '../job/job.service';
import { InputService } from '../nui/input.service';
import { ObjectProvider } from '../object/object.provider';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { BillboardRepository } from '../repository/billboard.repository';
import { TargetFactory } from '../target/target.factory';
import { BillboardService } from './billboard.service';

@Provider()
export class BillboardProvider {
    @Inject(BillboardRepository)
    private billboardRepository: BillboardRepository;

    @Inject(BillboardService)
    private billboardService: BillboardService;

    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(ObjectProvider)
    public objectProvider: ObjectProvider;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(InputService)
    public inputService: InputService;

    @Inject(ProgressService)
    public progressService: ProgressService;

    @Inject(JobService)
    public jobService: JobService;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoriesLoaded() {
        //Billboards : Attente du chargement de l'ensemble des ressources
        await wait(10000);

        const billboards = this.billboardRepository.get();
        for (const billboard of Object.values(billboards)) {
            if (!billboard.enabled || !billboard.imageUrl) {
                RemoveReplaceTexture(billboard.originDictName, billboard.originTextureName);
                continue;
            }
            this.billboardService.loadBillboard(
                billboard.imageUrl,
                billboard.originDictName,
                billboard.originTextureName
            );
            await wait(0);
        }
    }

    @OnEvent(ClientEvent.BILLBOARD_UPDATE)
    public async updateBillboard(billboard) {
        this.billboardRepository.updateBillboard(billboard);

        if (!billboard.enabled || !billboard.imageUrl) {
            RemoveReplaceTexture(billboard.originDictName, billboard.originTextureName);
            return;
        }

        this.billboardService.loadBillboard(billboard.imageUrl, billboard.originDictName, billboard.originTextureName);
    }

    @OnEvent(ClientEvent.BILLBOARD_DELETE)
    public async deleteBillboardTexture(billboard) {
        if (!billboard || !billboard.id) {
            return;
        }
        this.billboardRepository.deleteBillboard(billboard.id);
        RemoveReplaceTexture(billboard.originDictName, billboard.originTextureName);
    }

    @Once()
    public async mobileBillboard() {
        const billboards = Object.keys(billboardOffsets).map(Number);
        this.targetFactory.createForModel(
            billboards,
            [
                {
                    label: 'Démonter le panneau',
                    category: 'society',
                    canInteract: entity => {
                        const player = this.playerService.getPlayer();
                        const objectId = this.objectProvider.getIdFromEntity(entity);
                        const object = this.objectProvider.getObject(objectId);
                        return (
                            object.metadata?.job === player.job.id &&
                            player.job.onduty &&
                            this.jobService.hasPermission(player.job.id, JobPermission.NewsCreateBillboard)
                        );
                    },
                    action: async entity => {
                        const objectId = this.objectProvider.getIdFromEntity(entity);
                        const progress = await this.progressService.progress(
                            'billboard_use',
                            'Démontage en cours...',
                            10000,
                            {
                                dictionary: 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@',
                                name: 'machinic_loop_mechandplayer',
                                options: {
                                    onlyUpperBody: true,
                                },
                            }
                        );

                        if (!progress.completed) {
                            return;
                        }
                        TriggerServerEvent(ServerEvent.BILLBOARD_DELETE_PROP, objectId);
                    },
                },
                {
                    label: 'Mettre de la publicité',
                    category: 'society',
                    canInteract: entity => {
                        const player = this.playerService.getPlayer();
                        const objectId = this.objectProvider.getIdFromEntity(entity);
                        const object = this.objectProvider.getObject(objectId);
                        return (
                            object.metadata?.job === player.job.id &&
                            player.job.onduty &&
                            this.jobService.hasPermission(player.job.id, JobPermission.NewsUpdateBillboard)
                        );
                    },
                    action: async entity => {
                        const objectId = this.objectProvider.getIdFromEntity(entity);
                        const textureUrl = await this.inputService.askInput(
                            {
                                title: "URL de l'image",
                            },
                            HttpLinkValidator
                        );

                        if (!textureUrl) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.BILLBOARD_UPDATE_PROP, objectId, textureUrl);
                    },
                },
                {
                    label: 'Retirer la publicité',
                    category: 'society',
                    canInteract: entity => {
                        const player = this.playerService.getPlayer();
                        const objectId = this.objectProvider.getIdFromEntity(entity);
                        const object = this.objectProvider.getObject(objectId);
                        return (
                            object.metadata?.job === player.job.id &&
                            player.job.onduty &&
                            this.jobService.hasPermission(player.job.id, JobPermission.NewsUpdateBillboard)
                        );
                    },
                    action: async entity => {
                        const objectId = this.objectProvider.getIdFromEntity(entity);
                        TriggerServerEvent(ServerEvent.BILLBOARD_UPDATE_PROP, objectId);
                    },
                },
            ],
            100.0
        );
    }
}

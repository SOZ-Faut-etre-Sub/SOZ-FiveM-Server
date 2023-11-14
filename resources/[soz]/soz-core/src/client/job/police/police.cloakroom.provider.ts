import { PlayerService } from '@public/client/player/player.service';
import { PlayerWardrobe } from '@public/client/player/player.wardrobe';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Component } from '@public/shared/cloth';
import { VanillaComponentDrawableIndexMaxValue } from '@public/shared/drawable';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import {
    Armors,
    DUTY_OUTFIT_NAME,
    ObjectOutFits,
    POLICE_CLOAKROOM,
    PrisonerClothes,
    RankOutfit,
} from '@public/shared/job/police';
import { Vector3 } from '@public/shared/polyzone/vector';

import { JobCloakroomProvider } from '../job.cloakroom.provider';

const prisonerCloakroomInfos = [
    {
        job: JobType.LSPD,
        position: [580.91, -29.72, 76.63] as Vector3,
        length: 0.6,
        width: 9.0,
        heading: 350,
        minZ: 75.63,
        maxZ: 78.63,
    },
    {
        job: JobType.BCSO,
        position: [1864.93, 3681.1, 30.27] as Vector3,
        length: 1.0,
        width: 7.8,
        heading: 30,
        minZ: 29.27,
        maxZ: 32.27,
    },
];

@Provider()
export class PoliceCloakRoomProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(JobCloakroomProvider)
    private jobCloakroomProvider: JobCloakroomProvider;

    @Once(OnceStep.Start)
    public onStart() {
        for (const prisonerCloakroomInfo of prisonerCloakroomInfos) {
            this.targetFactory.createForBoxZone(
                `${prisonerCloakroomInfo.job}:prisonerCloakroom`,
                {
                    center: prisonerCloakroomInfo.position,
                    length: prisonerCloakroomInfo.length,
                    width: prisonerCloakroomInfo.width,
                    heading: prisonerCloakroomInfo.heading,
                    minZ: prisonerCloakroomInfo.minZ,
                    maxZ: prisonerCloakroomInfo.maxZ,
                },
                [
                    {
                        label: 'Se changer',
                        color: prisonerCloakroomInfo.job,
                        icon: 'fas fa-tshirt',
                        action: async () => {
                            await this.setPrisonerClothes();
                        },
                    },
                ],
                2.5
            );
        }
    }

    @OnEvent(ClientEvent.POLICE_OPEN_CLOAKROOM)
    public async openCloakroom(storageIdToSave: string) {
        const player = this.playerService.getPlayer();
        const model = GetEntityModel(PlayerPedId());
        const configs = POLICE_CLOAKROOM[player.job.id];
        configs[model][DUTY_OUTFIT_NAME].Components[Component.Decals] = { Drawable: 0, Texture: 0, Palette: 0 };
        if (RankOutfit[player.job.id][player.job.grade]) {
            configs[model][DUTY_OUTFIT_NAME].Components[Component.Decals] = {
                Drawable:
                    VanillaComponentDrawableIndexMaxValue[model][Component.Decals] +
                    RankOutfit[player.job.id][player.job.grade][0],
                Texture: RankOutfit[player.job.id][player.job.grade][1],
                Palette: 0,
            };
        }

        await this.jobCloakroomProvider.openCloakroom(storageIdToSave, configs, 'Tenue Personnalisée');
    }

    @OnEvent(ClientEvent.POLICE_APPLY_OUTFIT)
    public async applyDutyClothing(itemname: string, job: JobType) {
        const player = this.playerService.getPlayer();
        const model = GetEntityModel(PlayerPedId());

        const outfit = ObjectOutFits[job][model][itemname];
        outfit.Components[Component.Decals] = { Drawable: 0, Texture: 0, Palette: 0 };
        if (job == player.job.id && RankOutfit[player.job.id][player.job.grade] && itemname == 'outfit') {
            outfit.Components[Component.Decals] = {
                Drawable:
                    VanillaComponentDrawableIndexMaxValue[model][Component.Decals] +
                    RankOutfit[player.job.id][player.job.grade][0],
                Texture: RankOutfit[player.job.id][player.job.grade][1],
                Palette: 0,
            };
        }

        const { completed } = await this.playerWardrobe.waitProgress(false);
        if (completed) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit);
        }
    }

    @OnEvent(ClientEvent.POLICE_SET_PRISONER_CLOTHES)
    public async setPrisonerClothes() {
        const playerPed = PlayerPedId();
        const playerPedModel = GetEntityModel(playerPed);

        const hasPrisonerClothes = this.playerService.getState().hasPrisonerClothes;

        await this.playerWardrobe.waitProgress(false);

        TriggerServerEvent(
            ServerEvent.CHARACTER_SET_JOB_CLOTHES,
            hasPrisonerClothes ? null : PrisonerClothes[playerPedModel]
        );

        await this.playerService.updateState({
            hasPrisonerClothes: !hasPrisonerClothes,
        });
    }

    @OnEvent(ClientEvent.POLICE_SETUP_ARMOR)
    public async setupArmor(armorType: string) {
        const playerPed = PlayerPedId();
        const playerPedModel = GetEntityModel(playerPed);
        const armour = Armors[playerPedModel][armorType];
        if (!armour) {
            return;
        }
        TriggerServerEvent(
            ServerEvent.CHARACTER_SET_JOB_CLOTHES,
            { Components: { [Component.BodyArmor]: armour }, Props: {} },
            true
        );
    }
}

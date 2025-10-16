import { ItemService } from '@public/client/item/item.service';
import { PlayerHealthProvider } from '@public/client/player/player.health.provider';
import { PlayerService } from '@public/client/player/player.service';
import { PlayerWardrobe } from '@public/client/player/player.wardrobe';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Component } from '@public/shared/cloth';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { Armors, DUTY_OUTFIT_NAME, ObjectOutFits, PrisonerClothes, RankOutfit } from '@public/shared/job/police';
import { Zone } from '@public/shared/polyzone/box.zone';

import { InventoryType } from '../../../shared/inventory';
import { Vector3 } from '../../../shared/polyzone/vector';
import { InventoryManager } from '../../inventory/inventory.manager';
import { NuiMenu } from '../../nui/nui.menu';

const prisonerCloakroomInfos: Zone<string>[] = [
    {
        data: 'lspd',
        center: [580.91, -29.72, 76.63],
        length: 0.6,
        width: 9.0,
        heading: 350,
        minZ: 75.63,
        maxZ: 78.63,
    },
    {
        data: 'lspd_mr',
        center: [474.65, -992.71, 24.74],
        length: 1.0,
        width: 5.0,
        heading: -0.03,
        minZ: 24.54,
        maxZ: 26.74,
    },
    {
        data: 'lspd_mp1',
        center: [1143.53, -467.41, 60.28],
        length: 4.6,
        width: 0.7,
        heading: 76.73,
        minZ: 59.28,
        maxZ: 61.28,
    },
    {
        data: 'lspd_mp2',
        center: [1145.28, -469.91, 60.28],
        length: 2.4,
        width: 1.0,
        heading: 256.62,
        minZ: 59.28,
        maxZ: 61.28,
    },
    {
        data: 'lspd_mp3',
        center: [1144.9, -471.91, 60.28],
        length: 0.7,
        width: 4.6,
        heading: 166.24,
        minZ: 59.28,
        maxZ: 61.28,
    },
    {
        data: 'bcso',
        center: [1864.93, 3681.1, 30.27],
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

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerHealthProvider)
    private playerHealthProvider: PlayerHealthProvider;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Once(OnceStep.Start)
    public onStart() {
        for (const prisonerCloakroomInfo of prisonerCloakroomInfos) {
            this.targetFactory.createForBoxZone(
                `${prisonerCloakroomInfo.data}:prisonerCloakroom`,
                prisonerCloakroomInfo,
                [
                    {
                        label: 'Se changer',
                        icon: 'global/tshirt',
                        category: 'citizen',
                        action: async () => {
                            await this.setPrisonerClothes();
                        },
                    },
                ],
                2.5
            );
        }
    }

    @OnEvent(ClientEvent.POLICE_APPLY_OUTFIT)
    public async applyDutyClothing(itemname: string, job: JobType, plates?: number) {
        const player = this.playerService.getPlayer();
        const model = GetEntityModel(PlayerPedId());

        const outfit = ObjectOutFits[job][model][itemname];
        outfit.Components[Component.Decals] = { Drawable: 0, Texture: 0, Palette: 0 };
        if (
            job == player.job.id &&
            RankOutfit[player.job.id][model] &&
            RankOutfit[player.job.id][model][DUTY_OUTFIT_NAME] &&
            RankOutfit[player.job.id][model][DUTY_OUTFIT_NAME][player.job.grade] &&
            itemname == 'outfit'
        ) {
            outfit.Components[Component.Decals] = {
                Drawable: RankOutfit[player.job.id][model][DUTY_OUTFIT_NAME][player.job.grade][0],
                Texture: RankOutfit[player.job.id][model][DUTY_OUTFIT_NAME][player.job.grade][1],
                Palette: 0,
                Collection: 'soz_bcso',
            };
        }

        const { completed } = await this.playerWardrobe.waitProgress(false);
        if (completed) {
            if (itemname == 'light_intervention_outfit') {
                const itemDef = this.itemService.getItem(itemname);
                this.playerHealthProvider.setupArmorPlates(plates, itemDef?.maxplates, true);
            }
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
    public async setupArmor(armorType: string, plates: number, maxPlates?: number, usedArmorPlates?: number) {
        const playerPed = PlayerPedId();
        const playerPedModel = GetEntityModel(playerPed);
        const armour = Armors[playerPedModel][armorType];
        if (!armour) {
            return;
        }

        this.playerService.updateState({
            nbArmorPlates: plates ?? 0,
            maxArmorPlates: maxPlates ?? 0,
            usedArmorPlates: usedArmorPlates !== undefined ? usedArmorPlates : plates ?? 0,
        });

        if (plates > 0) {
            SetPlayerWeaponDefenseModifier(PlayerId(), 0.1);
            SetPlayerWeaponDefenseModifier_2(PlayerId(), 0.1);
        }

        TriggerServerEvent(
            ServerEvent.CHARACTER_SET_JOB_CLOTHES,
            {
                Components: { [Component.BodyArmor]: armour },
                Props: {},
            },
            true,
            false
        );
    }

    @OnEvent(ClientEvent.POLICE_REMOVE_ARMOR)
    public async removeArmor() {
        await this.playerWardrobe.setClothConfig('HideBulletproof', true, true);
    }

    @OnNuiEvent(NuiEvent.PersonnalCloakroom)
    public async onPersonnalCloakroom() {
        this.nuiMenu.closeAll();

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (!player.apartment || !player.apartment.identifier) {
            return;
        }

        const position = GetEntityCoords(PlayerPedId()) as Vector3;

        this.inventoryManager.openInventory(
            InventoryType.HouseCloakroom,
            'house_cloakroom_' + player.apartment.identifier,
            position
        );
    }
}

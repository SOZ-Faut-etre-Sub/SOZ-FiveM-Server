import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { CraftService } from '@public/client/craft/craft.service';
import { PedFactory } from '@public/client/factory/ped.factory';
import { FeatureProvider } from '@public/client/feature/feature.provider';
import { PlayerInOutService } from '@public/client/player/player.inout.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { emitRpc } from '@public/core/rpc';
import { CraftsList } from '@public/shared/craft/craft';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { JobType } from '@public/shared/job';
import {
    FDFConfig,
    FDFCraftZones,
    FDFFieldBlips,
    FDFFieldKind,
    FDFFields,
    FDFGreenHouse,
    FDFTreeField,
} from '@public/shared/job/fdf';
import { MenuType } from '@public/shared/nui/menu';
import { toVector4Object, Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';

@Provider()
export class FDFProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(CraftService)
    private craftService: CraftService;

    private state = {
        [FDFFieldBlips.field]: false,
        [FDFFieldBlips.greenhouse]: false,
        [FDFFieldBlips.apple]: false,
        [FDFFieldBlips.orange]: false,
        [FDFFieldBlips.resell]: false,
        [FDFFieldBlips.lemon]: false,
        displayGarlicBlip: false,
        garlicEnabled: false,
    };
    private areaBlips = new Map<FDFFieldBlips, number[]>();

    @Once(OnceStep.PlayerLoaded)
    public setupFDFJob() {
        Object.values(FDFFieldBlips).forEach(kind => this.areaBlips.set(kind, []));

        this.craftService.createBtargetZoneCraft(FDFCraftZones, 'food/chef', 'Préparer', JobType.FDF);

        FDFConfig.resellZones.forEach((zone, index) => {
            this.pedFactory.createPedOnGrid({
                coords: toVector4Object(zone.npcCoord),
                model: zone.npcModel,
                freeze: true,
                invincible: true,
                blockevents: true,
                scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
                dropItemCallback: (inventoryId, inventoryItem, amount) => {
                    TriggerServerEvent(ServerEvent.JOB_RESELL_ITEM, inventoryId, inventoryItem, amount, zone.name);
                },
            });

            this.blipFactory.create('fdfResellBlip' + index, {
                name: 'Point de vente des palettes',
                coords: toVector4Object(zone.npcCoord),
                sprite: 478,
                color: 28,
                scale: 0.9,
            });
            this.blipFactory.hide('fdfResellBlip' + index, true);
        });

        /*
        this.blipFactory.create('jobs:fdf', {
            name: 'Ferme de Fou',
            coords: { x: 2443.96, y: 4974.61, z: 47.39 },
            sprite: 381,
            scale: 1.2,
        });
        */

        if (this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            this.state.garlicEnabled = true;

            this.blipFactory.create('displayGarlicBlip', {
                name: "Champ de gousses d'ail",
                coords: { x: 2253.42, y: 4835.86, z: 40.66 },
                sprite: 819,
                scale: 0.9,
            });

            this.blipFactory.hide('displayGarlicBlip', true);

            this.targetFactory.createForBoxZone(
                'fdf:garlic_harvest',
                {
                    center: [2253.42, 4835.86, 40.66],
                    length: 33.2,
                    width: 8.4,
                    minZ: 38.66,
                    maxZ: 40.66,
                    heading: 45,
                },
                [
                    {
                        label: 'Récolter',
                        icon: 'food/collecter',
                        job: JobType.FDF,
                        category: 'society',
                        action: () => {
                            TriggerServerEvent(ServerEvent.FDF_GARLIC_HARVEST);
                        },
                    },
                ]
            );
        }
    }

    @OnEvent(ClientEvent.JOBS_FDF_OPEN_SOCIETY_MENU)
    public async onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.FDFJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        const crafting = await emitRpc<CraftsList>(RpcServerEvent.CRAFT_GET_RECIPES, JobType.FDF);
        this.nuiMenu.openMenu(MenuType.FDFJobMenu, {
            recipes: crafting.categories,
            state: this.state,
        });
    }

    @OnEvent(ClientEvent.JOB_DUTY_CHANGE)
    public async removeBlip(duty: boolean) {
        if (!duty) {
            for (const blips of this.areaBlips.values()) {
                for (const blip of blips) {
                    RemoveBlip(blip);
                }
                blips.length = 0;
            }
        }
    }

    @OnNuiEvent(NuiEvent.FdfDisplayBlip)
    public async onDisplayBlip({ type, value }: { type: FDFFieldBlips | 'displayGarlicBlip'; value: boolean }) {
        this.state[type] = value;

        if (type == FDFFieldBlips.resell) {
            for (let i = 0; i < FDFConfig.resellZones.length; i++) {
                this.blipFactory.hide('fdfResellBlip' + i, !value);
            }
            return;
        }

        if (type === 'displayGarlicBlip') {
            this.blipFactory.hide('displayGarlicBlip', !value);
            return;
        }

        if (value) {
            switch (type) {
                case FDFFieldBlips.field:
                    this.createFieldBlips();
                    break;
                case FDFFieldBlips.greenhouse:
                    this.createGreenHouseBlips();
                    break;
                case FDFFieldBlips.apple:
                    this.createAppleBlips();
                    break;
                case FDFFieldBlips.orange:
                    this.createOrangeBlips();
                    break;
                case FDFFieldBlips.lemon:
                    this.createLemonBlips();
                    break;
            }
        } else {
            const blips = this.areaBlips.get(type);
            for (const blip of blips) {
                RemoveBlip(blip);
            }
            blips.length = 0;
        }
    }

    private createFieldBlips() {
        for (const field of Object.values(FDFFields)) {
            this.createAreaBlips(FDFFieldBlips.field, 52, field.data);
        }
    }

    private createGreenHouseBlips() {
        for (const field of Object.values(FDFGreenHouse)) {
            this.createAreaBlips(FDFFieldBlips.greenhouse, 62, field.data);
        }
    }

    private createAppleBlips() {
        this.createAreaBlips(FDFFieldBlips.apple, 49, FDFTreeField[FDFFieldKind.apple].data);
    }

    private createOrangeBlips() {
        this.createAreaBlips(FDFFieldBlips.orange, 47, FDFTreeField[FDFFieldKind.orange].data);
    }

    private createLemonBlips() {
        this.createAreaBlips(FDFFieldBlips.lemon, 46, FDFTreeField[FDFFieldKind.lemon].data);
    }

    private createAreaBlips(name: FDFFieldBlips, color: number, data: Vector4) {
        const newBlip = AddBlipForRadius(data[0], data[1], data[2], data[3]);
        SetBlipColour(newBlip, color);
        SetBlipAlpha(newBlip, 200);
        this.areaBlips.get(name).push(newBlip);
    }
}

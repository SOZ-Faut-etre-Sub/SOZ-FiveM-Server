import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { CraftService } from '@public/client/craft/craft.service';
import { PedFactory } from '@public/client/factory/ped.factory';
import { PlayerInOutService } from '@public/client/player/player.inout.service';
import { emitRpc } from '@public/core/rpc';
import { CraftsList } from '@public/shared/craft/craft';
import { ClientEvent, NuiEvent } from '@public/shared/event';
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
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';

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

    @Inject(JobService)
    private jobService: JobService;

    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(CraftService)
    private craftService: CraftService;

    private state = {
        [FDFFieldBlips.field]: false,
        [FDFFieldBlips.greenhouse]: false,
        [FDFFieldBlips.apple]: false,
        [FDFFieldBlips.orange]: false,
        [FDFFieldBlips.resell]: false,
        [FDFFieldBlips.lemon]: false,
    };
    private areaBlips = new Map<FDFFieldBlips, number[]>();

    @Once(OnceStep.PlayerLoaded)
    public setupFDFJob() {
        Object.values(FDFFieldBlips).forEach(kind => this.areaBlips.set(kind, []));

        this.craftService.createBtargetZoneCraft(FDFCraftZones, 'c:/food/chef.png', 'Préparer', JobType.FDF);

        FDFConfig.resellZones.forEach((zone, index) => {
            this.pedFactory.createPed({
                coords: toVector4Object(zone.npcCoord),
                model: zone.npcModel,
                freeze: true,
                invincible: true,
                blockevents: true,
                scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
            });
            this.playerInOutService.add(zone.name, zone.zone, isInside => {
                TriggerEvent(
                    'player/setCurrentResellZone',
                    isInside
                        ? {
                              ZoneName: zone.name,
                              SourceAccount: 'farm_fdf',
                              TargetAccount: 'safe_fdf',
                          }
                        : null
                );
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

        this.blipFactory.create('jobs:fdf', {
            name: 'Ferme de Fou',
            coords: { x: 2443.96, y: 4974.61, z: 47.39 },
            sprite: 381,
            scale: 1.2,
        });
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
            onDuty: this.playerService.isOnDuty(),
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
    public async onDisplayBlip({ type, value }: { type: FDFFieldBlips; value: boolean }) {
        this.state[type] = value;

        if (type == FDFFieldBlips.resell) {
            for (let i = 0; i < FDFConfig.resellZones.length; i++) {
                this.blipFactory.hide('fdfResellBlip' + i, !value);
            }
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

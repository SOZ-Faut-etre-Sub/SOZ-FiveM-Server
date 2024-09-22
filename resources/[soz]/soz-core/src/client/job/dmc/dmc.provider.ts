import { BlipFactory } from '@public/client/blip';
import { CraftService } from '@public/client/craft/craft.service';
import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { JobType } from '@public/shared/job';
import { DMC_CRAFT_ZONES, DmcConverterState } from '@public/shared/job/dmc';
import { MenuType } from '@public/shared/nui/menu';
import { RpcServerEvent } from '@public/shared/rpc';

import { BoxZone } from '../../../shared/polyzone/box.zone';
import { PedFactory } from '../../factory/ped.factory';
import { PlayerInOutService } from '../../player/player.inout.service';
import { JobService } from '../job.service';

@Provider()
export class DmcProvider {
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

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(CraftService)
    private craftService: CraftService;

    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    private blipState = {
        'job:dmc:iron_mine': false,
        'job:dmc:aluminium_mine': false,
        'job:dmc:resell': false,
    };

    public createBlips() {
        this.blipFactory.create('job:dmc:depot', {
            name: 'DeMetal Company',
            sprite: 382,
            color: 0,
            scale: 0.9,
            coords: { x: 1078.86, y: -1974.87, z: 31.47 },
        });
        this.blipFactory.create('job:dmc:iron_mine', {
            name: 'Mine de Fer',
            sprite: 382,
            color: 0,
            scale: 0.9,
            coords: { x: -596.19, y: 2090.32, z: 131.41 },
        });
        this.blipFactory.create('job:dmc:aluminium_mine', {
            name: "Mine d'Aluminium",
            sprite: 382,
            color: 0,
            scale: 0.9,
            coords: { x: 2953.05, y: 2787.8, z: 41.5 },
        });
        this.blipFactory.create('job:dmc:resell', {
            name: 'Point de revente de métaux',
            sprite: 478,
            color: 28,
            scale: 0.9,
            coords: { x: -132.7, y: -2383.92, z: 6.0 },
        });
        this.blipFactory.hide('job:dmc:aluminium_mine', true);
        this.blipFactory.hide('job:dmc:iron_mine', true);
        this.blipFactory.hide('job:dmc:resell', true);

        if (isFeatureEnabled(Feature.Halloween)) {
            this.blipFactory.create('job:dmc:uranium_mine', {
                name: "Mine d'uranium",
                sprite: 382,
                color: 0,
                scale: 0.9,
                coords: { x: 2222.34, y: 3182.4, z: 51.01 },
            });
            this.blipFactory.hide('job:dmc:uranium_mine', true);

            this.blipState['job:dmc:uranium_mine'] = false;
        }
    }

    public async isConverterEnabled() {
        const converterState = await emitRpc<DmcConverterState>(RpcServerEvent.DMC_GET_CONVERTER_STATE);
        return converterState.enabled;
    }

    @OnEvent(ClientEvent.JOBS_DMC_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.DmcJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.DmcJobMenu, {
            blipState: this.blipState,
        });
    }

    @OnNuiEvent(NuiEvent.DmcToggleBlip)
    public async onDisplayBlip({ blip, value }: { blip: string; value: boolean }) {
        this.blipState[blip] = value;
        this.blipFactory.hide(blip, !value);
    }

    @Once(OnceStep.PlayerLoaded)
    public setupDmcJob() {
        this.createBlips();

        // Converter zone
        this.targetFactory.createForBoxZone(
            'dmc:converter',
            {
                center: [1075.32, -1979.5, 31.82],
                length: 1.6,
                width: 3.6,
                minZ: 30.42,
                maxZ: 31.62,
                heading: 325.32,
            },
            [
                {
                    icon: 'dmc/allumer',
                    label: 'Allumer le Convertisseur',
                    category: 'society',
                    canInteract: async () => {
                        return !(await this.isConverterEnabled());
                    },
                    job: JobType.DMC,
                    action: async () => {
                        TriggerServerEvent(ServerEvent.DMC_TOGGLE_CONVERTER, true);
                    },
                    blackoutGlobal: true,
                    blackoutJob: JobType.DMC,
                },
                {
                    icon: 'dmc/allumer',
                    label: 'Eteindre le Convertisseur',
                    category: 'society',
                    canInteract: async () => {
                        return await this.isConverterEnabled();
                    },
                    job: JobType.DMC,
                    action: async () => {
                        TriggerServerEvent(ServerEvent.DMC_TOGGLE_CONVERTER, false);
                    },
                },
                {
                    icon: 'dmc/temperature',
                    label: 'Consulter la température',
                    category: 'society',
                    canInteract: async () => {
                        return await this.isConverterEnabled();
                    },
                    job: JobType.DMC,
                    action: async () => {
                        const converterState = await emitRpc<DmcConverterState>(RpcServerEvent.DMC_GET_CONVERTER_STATE);
                        this.notifier.notify(
                            `La température de la Fonderie est actuellement à ~g~${converterState.temperature}°C~s~.`
                        );
                    },
                },
                {
                    icon: 'dmc/temperature-set',
                    label: 'Modifier la température',
                    category: 'society',
                    canInteract: async () => {
                        return await this.isConverterEnabled();
                    },
                    job: JobType.DMC,
                    action: async () => {
                        const newTemperatureInput = await this.inputService.askInput({
                            title: 'Modifier la température',
                            maxCharacters: 4,
                        });
                        const newTemperature = parseInt(newTemperatureInput);
                        if (isNaN(newTemperature) || newTemperature < 0) {
                            this.notifier.error('Valeur incorrecte');
                            return;
                        }
                        if (newTemperature > 2000) {
                            this.notifier.error('La température ne peut pas dépasser 2000°C');
                            return;
                        }

                        TriggerServerEvent(ServerEvent.DMC_SET_CONVERTER_TARGET_TEMPERATURE, newTemperature);
                    },
                },
            ]
        );

        // Craft zones
        this.craftService.createBtargetZoneCraft(DMC_CRAFT_ZONES, 'dmc/confection', 'Forger', JobType.DMC, {
            weapon: 'weapon_hammer',
        });

        // Resell zone
        this.pedFactory.createPedOnGrid({
            model: 's_m_y_dockwork_01',
            coords: { x: -132.7, y: -2383.92, z: 5.0, w: 174.18 },
            freeze: true,
            invincible: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_CLIPBOARD',
        });

        this.playerInOutService.add(
            'Resell:LSPort:Dmc',
            new BoxZone([-132.7, -2383.92, 5.0], 3.0, 3.0, {
                minZ: 4.0,
                maxZ: 8.0,
            }),
            isInside => {
                if (isInside) {
                    TriggerEvent('player/setCurrentResellZone', {
                        ZoneName: 'Resell:LSPort:Dmc',
                        SourceAccount: 'farm_dmc',
                        TargetAccount: 'safe_dmc',
                    });
                } else {
                    TriggerEvent('player/setCurrentResellZone', null);
                }
            }
        );
    }
}

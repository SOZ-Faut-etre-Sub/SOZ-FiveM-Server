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
import { JobPermission, JobType } from '@public/shared/job';
import { DMC_CRAFT_ZONES, DmcConverterState } from '@public/shared/job/dmc';
import { MenuType } from '@public/shared/nui/menu';
import { RpcServerEvent } from '@public/shared/rpc';

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
            onDuty: this.playerService.isOnDuty(),
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

        // Duty zone
        this.targetFactory.createForBoxZone(
            'dmc:duty',
            {
                center: [1078.86, -1974.87, 31.47],
                length: 0.4,
                width: 1.2,
                minZ: 31.07,
                maxZ: 32.47,
                heading: 324.53,
            },
            [
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Prise de service',
                    canInteract: () => {
                        return !this.playerService.isOnDuty();
                    },
                    job: JobType.DMC,
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: JobType.DMC,
                },
                {
                    icon: 'fas fa-users',
                    label: 'Employé(e)s en service',
                    action: () => {
                        TriggerServerEvent('QBCore:GetEmployOnDuty');
                    },
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return (
                            this.playerService.isOnDuty() &&
                            this.jobService.hasPermission(player.job.id, JobPermission.OnDutyView)
                        );
                    },
                    job: JobType.DMC,
                },
            ]
        );

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
                    icon: 'c:/dmc/allumer.png',
                    label: 'Allumer le Convertisseur',
                    canInteract: async () => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }
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
                    icon: 'c:/dmc/allumer.png',
                    label: 'Eteindre le Convertisseur',
                    canInteract: async () => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }
                        return await this.isConverterEnabled();
                    },
                    job: JobType.DMC,
                    action: async () => {
                        TriggerServerEvent(ServerEvent.DMC_TOGGLE_CONVERTER, false);
                    },
                },
                {
                    icon: 'c:/dmc/temperature.png',
                    label: 'Consulter la température',
                    canInteract: async () => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }
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
                    icon: 'c:/dmc/temperature-set.png',
                    label: 'Modifier la température',
                    canInteract: async () => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }
                        return await this.isConverterEnabled();
                    },
                    job: JobType.DMC,
                    action: async () => {
                        const newTemperatureInput = await this.inputService.askInput({
                            title: 'Modifier la température',
                            defaultValue: '',
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
        this.craftService.createBtargetZoneCraft(DMC_CRAFT_ZONES, 'c:/dmc/confection.png', 'Forger', JobType.DMC, {
            weapon: 'weapon_hammer',
        });
    }
}

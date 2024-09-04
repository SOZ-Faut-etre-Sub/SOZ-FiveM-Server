import { Once } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { Monitor } from '@public/client/monitor/monitor';
import { InputService } from '@public/client/nui/input.service';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { emitRpc, emitRpcCache } from '@public/core/rpc';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { PlasterLocation } from '@public/shared/job/lsmc';
import { MenuType } from '@public/shared/nui/menu';
import { PlayerLicenceType } from '@public/shared/player';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { MultiZone } from '@public/shared/polyzone/multi.zone';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { PositiveNumberValidator } from '../../../shared/nui/input';
import { PlayerListStateService } from '../../player/player.list.state.service';
import { PoliceLicenceProvider } from '../police/police.licence.provider';
import { LSMCDeathProvider } from './lsmc.death.provider';

const hopital = new MultiZone([
    new BoxZone([346.73, -1413.53, 32.26], 84.4, 92.6, {
        heading: 320,
        minZ: 28.46,
        maxZ: 39.86,
    }),
    new BoxZone([1826.47, 3679.85, 33.73], 36.4, 33.6, {
        heading: 211.67,
        minZ: 32.73,
        maxZ: 41.13,
    }),
]);

@Provider()
export class LSMCInteractionProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(ProgressService)
    public progressService: ProgressService;

    @Inject(LSMCDeathProvider)
    public LSMCDeathProvider: LSMCDeathProvider;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PoliceLicenceProvider)
    private policeLicenceProvider: PoliceLicenceProvider;

    @Inject(Monitor)
    public monitor: Monitor;

    @Inject(PlayerListStateService)
    private playerListStateService: PlayerListStateService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @Once()
    public onStart() {
        this.targetFactory.createForAllPlayer([
            {
                label: 'Rehabiliter',
                color: JobType.LSMC,
                icon: 'c:ems/Rehabiliter.png',
                job: JobType.LSMC,
                blackoutGlobal: true,
                blackoutJob: 'lsmc',
                category: 'society',
                canInteract: async entity => {
                    if (!hopital.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3)) {
                        return false;
                    }

                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return await emitRpc<boolean>(RpcServerEvent.LSMC_CAN_REMOVE_ITT, target);
                },
                action: entity => {
                    TriggerServerEvent(
                        ServerEvent.LSMC_TOOGLE_ITT,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    );
                },
            },
            {
                label: 'Deshabiliter',
                color: JobType.LSMC,
                icon: 'c:ems/Deshabiliter.png',
                job: JobType.LSMC,
                blackoutGlobal: true,
                blackoutJob: 'lsmc',
                category: 'society',
                canInteract: async entity => {
                    if (!hopital.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3)) {
                        return false;
                    }

                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return await emitRpc<boolean>(RpcServerEvent.LSMC_CAN_SET_ITT, target);
                },
                action: async entity => {
                    const duration = await this.inputService.askInput(
                        {
                            title: "Durée avant que le pharmacien puisse enlever l'ITT en minutes",
                            defaultValue: '',
                        },
                        PositiveNumberValidator
                    );

                    if (!duration) {
                        return;
                    }

                    TriggerServerEvent(
                        ServerEvent.LSMC_TOOGLE_ITT,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        duration * 60_000
                    );
                },
            },
            {
                label: 'Déshabiller',
                color: JobType.LSMC,
                icon: 'c:ems/desabhiller.png',
                job: JobType.LSMC,
                category: 'society',
                canInteract: entity => {
                    if (!hopital.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3)) {
                        return false;
                    }

                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return !this.playerListStateService.isWearingPatientOutfit(target);
                },
                action: entity => {
                    TriggerServerEvent(
                        ServerEvent.LSMC_SET_PATIENT_OUTFIT,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        true
                    );
                },
            },
            {
                label: 'Rhabiller',
                color: JobType.LSMC,
                icon: 'c:ems/rhabiller.png',
                job: JobType.LSMC,
                category: 'society',
                canInteract: entity => {
                    if (!hopital.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3)) {
                        return false;
                    }

                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return this.playerListStateService.isWearingPatientOutfit(target);
                },
                action: entity => {
                    TriggerServerEvent(
                        ServerEvent.LSMC_SET_PATIENT_OUTFIT,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        false
                    );
                },
            },
            {
                label: 'Soigner',
                color: JobType.LSMC,
                icon: 'c:ems/heal.png',
                job: JobType.LSMC,
                category: 'society',
                canInteract: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return !this.playerListStateService.isDead(target);
                },
                action: async entity => {
                    const { completed } = await this.progressService.progress(
                        'Soigner',
                        'Appliquer un bandage..',
                        10000,
                        {
                            task: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                        },
                        {
                            disableMovement: true,
                            disableCarMovement: true,
                            disableMouse: false,
                            disableCombat: true,
                        }
                    );

                    if (!completed) {
                        return;
                    }

                    const serverId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    TriggerServerEvent(ServerEvent.LSMC_HEAL, serverId);
                },
                item: 'firstaid',
            },
            {
                label: 'Réanimer',
                color: JobType.LSMC,
                icon: 'c:ems/revive.png',
                job: JobType.LSMC,
                category: 'society',
                canInteract: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return this.playerListStateService.isDead(target);
                },
                action: entity => {
                    this.LSMCDeathProvider.reviveTarget(entity, true);
                },
                item: 'bloodbag',
            },
            {
                label: 'Utiliser Défibrilateur',
                color: JobType.LSMC,
                icon: 'c:ems/revive.png',
                category: 'society',
                canInteract: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return this.playerListStateService.isDead(target);
                },
                action: entity => {
                    this.LSMCDeathProvider.reviveTarget(entity, false);
                },
                item: 'defibrillator',
            },
            {
                label: 'Prise de sang',
                color: JobType.LSMC,
                icon: 'c:ems/take_blood.png',
                job: JobType.LSMC,
                category: 'society',
                canInteract: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    return !this.playerListStateService.isDead(target);
                },
                action: async entity => {
                    const { completed } = await this.progressService.progress(
                        'Take_Blood',
                        'Vous faites une prise de sang...',
                        10000,
                        {
                            task: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                        },
                        {
                            disableMovement: true,
                            disableCarMovement: true,
                            disableMouse: false,
                            disableCombat: true,
                        }
                    );

                    if (!completed) {
                        return;
                    }

                    TriggerServerEvent(
                        ServerEvent.LSMC_GIVE_BLOOD,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    );
                    this.monitor.traceEvent('job_lsmc_bloodbag', {
                        target_source: GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        position: GetEntityCoords(entity) as Vector3,
                    });
                },
                item: 'empty_bloodbag',
            },
            {
                label: 'Donner le diplôme de secourisme',
                color: JobType.LSMC,
                job: JobType.LSMC,
                icon: 'c:ems/rescuer.png',
                category: 'society',
                canInteract: async entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const hasRescuerLicense = await emitRpcCache<number>(
                        RpcServerEvent.POLICE_LICENSE_HAS_RECUER,
                        target
                    );
                    return !hasRescuerLicense;
                },
                action: async entity => {
                    const completed =
                        await this.policeLicenceProvider.playLicenceAnimation('Enregistrement du diplôme...');
                    if (!completed) {
                        return;
                    }

                    TriggerServerEvent(
                        ServerEvent.POLICE_GIVE_LICENCE,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        PlayerLicenceType.Rescuer
                    );
                },
            },
            {
                label: 'Retirer le diplôme de secourisme',
                color: JobType.LSMC,
                job: JobType.LSMC,
                icon: 'c:ems/notrescuer.png',
                category: 'society',
                canInteract: async entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const hasRescuerLicense = await emitRpcCache<number>(
                        RpcServerEvent.POLICE_LICENSE_HAS_RECUER,
                        target
                    );
                    return !!hasRescuerLicense;
                },
                action: async entity => {
                    const completed =
                        await this.policeLicenceProvider.playLicenceAnimation('Suppression du diplôme...');
                    if (!completed) {
                        return;
                    }

                    TriggerServerEvent(
                        ServerEvent.POLICE_REMOVE_LICENCE,
                        GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                        PlayerLicenceType.Rescuer
                    );
                },
            },
            {
                label: 'Plâtre',
                color: JobType.LSMC,
                job: JobType.LSMC,
                icon: 'c:ems/platre.png',
                category: 'society',
                action: async entity => {
                    const playerServerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const data = await emitRpc<PlasterLocation[]>(RpcServerEvent.LSMC_PLAYER_PLASTER, playerServerId);

                    this.nuiMenu.openMenu<MenuType.LsmcPlaster>(MenuType.LsmcPlaster, {
                        locations: data,
                        playerServerId: playerServerId,
                    });
                },
            },
            {
                label: 'Naloxone',
                color: JobType.LSMC,
                job: JobType.LSMC,
                icon: 'c:ems/naloxone.png',
                category: 'society',
                canInteract: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return !this.playerListStateService.isDead(target);
                },
                action: async entity => {
                    const playerServerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(ServerEvent.LSMC_NALOXONE, playerServerId);
                },
                item: 'naloxone',
            },
            {
                label: 'Morphine',
                color: JobType.LSMC,
                icon: 'c:ems/morphine.png',
                job: JobType.LSMC,
                category: 'society',
                canInteract: entity => {
                    const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return !this.playerListStateService.isDead(target);
                },
                action: async entity => {
                    const serverId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(ServerEvent.LSMC_MORPHINE, serverId);
                },
                item: 'morphine',
            },
        ]);

        this.targetFactory.createForBoxZone(
            'lsmc_amphi_dummy',
            new BoxZone([344.82, -1366.77, 33.31], 1.0, 1.95, {
                heading: 229.77,
                minZ: 32.31,
                maxZ: 32.71,
            }),
            [
                {
                    label: "S'entrainer aux soins",
                    color: JobType.LSMC,
                    icon: 'c:ems/heal.png',
                    job: JobType.LSMC,
                    category: 'society',
                    action: () => {
                        this.progressService.progress(
                            'heal_training',
                            'Entraînement aux soins...',
                            10000,
                            {
                                task: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                            },
                            {
                                useAnimationService: true,
                                disableMovement: true,
                                disableCarMovement: true,
                                disableMouse: false,
                                disableCombat: true,
                            }
                        );
                    },
                },
                {
                    label: "S'entrainer aux piqûres",
                    color: JobType.LSMC,
                    icon: 'c:ems/morphine.png',
                    job: JobType.LSMC,
                    category: 'society',
                    action: () => {
                        this.progressService.progress(
                            'shooting_training',
                            'Entraînement aux piqûres...',
                            10000,
                            {
                                name: 'miranda_shooting_up',
                                dictionary: 'rcmpaparazzo1ig_4',
                                options: {
                                    onlyUpperBody: true,
                                },
                                playbackRate: 0.4,
                            },
                            {
                                useAnimationService: true,
                                firstProp: {
                                    model: 'prop_syringe_01',
                                    bone: 28422,
                                    coords: { x: 0.0, y: 0.0, z: -0.045 },
                                    rotation: { x: 0, y: 0, z: 0 },
                                },
                            }
                        );
                    },
                },
                {
                    label: "S'entrainer à la chirurgie",
                    color: JobType.LSMC,
                    icon: 'c:ems/greffer.png',
                    job: JobType.LSMC,
                    category: 'society',
                    action: () => {
                        this.progressService.progress(
                            'Soigner',
                            'Entraînement à la chirurgie',
                            10000,
                            {
                                dictionary: 'mini@repair',
                                name: 'fixing_a_ped',
                            },
                            {
                                useAnimationService: true,
                                disableMovement: true,
                                disableCarMovement: true,
                            }
                        );
                    },
                },
            ]
        );
    }
}

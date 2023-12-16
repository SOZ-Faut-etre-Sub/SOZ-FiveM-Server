import { AnimationRunner } from '@public/client/animation/animation.factory';
import { AnimationService } from '@public/client/animation/animation.service';
import { Notifier } from '@public/client/notifier';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PhoneService } from '@public/client/phone/phone.service';
import { PlayerListStateService } from '@public/client/player/player.list.state.service';
import { PlayerService } from '@public/client/player/player.service';
import { PlayerStateProvider } from '@public/client/player/player.state.provider';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';
import { PlayerLicenceType } from '@public/shared/player';
import { RpcServerEvent } from '@public/shared/rpc';
import { inject } from 'inversify';

import { JobInteractionService } from '../job.interaction.service';
import { StonkCloakRoomProvider } from '../stonk/stonk.cloakroom.provider';
import { PoliceAnimationProvider } from './police.animation.provider';

const jobsCanFine = [JobType.LSPD, JobType.BCSO, JobType.SASP];
const jobsCanFouille = [JobType.LSPD, JobType.BCSO, JobType.CashTransfer, JobType.SASP];
const jobsCanEscort = [JobType.LSPD, JobType.BCSO, JobType.CashTransfer, JobType.SASP, JobType.LSMC, JobType.FBI];
const jobsCanBreathAnalyze = [JobType.LSPD, JobType.BCSO, JobType.LSMC, JobType.SASP];

@Provider()
export class PolicePlayerProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(StonkCloakRoomProvider)
    private stonkCloakRoomProvider: StonkCloakRoomProvider;

    @Inject(PlayerListStateService)
    private playerListStateService: PlayerListStateService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @inject(JobInteractionService)
    private jobInteractionService: JobInteractionService;

    @Inject(PoliceAnimationProvider)
    private policeAnimationProvider: PoliceAnimationProvider;

    @Inject(PhoneService)
    private phoneService: PhoneService;

    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerStateProvider)
    private playerStateProvider: PlayerStateProvider;

    private escortingAnimation: null | { animation: AnimationRunner | null; target: number; crimi: boolean } = null;
    private escortedAnimation: null | { animation: AnimationRunner | null; target: number; crimi: boolean } = null;

    @Once(OnceStep.Start)
    public onStart() {
        for (const job of jobsCanFine) {
            this.targetFactory.createForAllPlayer([
                {
                    label: 'Amender',
                    color: job,
                    icon: 'c:police/amender.png',
                    job: job,
                    blackoutJob: job,
                    blackoutGlobal: true,
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    action: entity => {
                        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                        this.nuiMenu.openMenu(MenuType.PoliceJobFines, {
                            job: job,
                            playerServerId: target,
                        });
                    },
                },
                {
                    label: 'Permis',
                    color: job,
                    icon: 'c:police/permis.png',
                    job: job,
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    action: async entity => {
                        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                        const licences = await emitRpc<Partial<Record<PlayerLicenceType, number>>>(
                            RpcServerEvent.PLAYER_GET_LICENCES,
                            target
                        );

                        this.nuiMenu.openMenu(MenuType.PoliceJobLicences, {
                            job: job,
                            playerServerId: target,
                            playerLicences: licences,
                        });
                    },
                },
                {
                    label: 'Menotter',
                    color: job,
                    icon: 'c:police/menotter.png',
                    item: 'handcuffs',
                    job: job,
                    canInteract: entity => {
                        return (
                            this.playerService.isOnDuty() &&
                            !IsEntityPlayingAnim(entity, 'mp_arresting', 'idle', 3) &&
                            !IsPedInAnyVehicle(entity, true) &&
                            !IsPedInAnyVehicle(PlayerPedId(), true)
                        );
                    },
                    action: async entity => {
                        if (!IsPedRagdoll(PlayerPedId())) {
                            const player = NetworkGetPlayerIndexFromPed(entity);
                            if (
                                !IsPedInAnyVehicle(GetPlayerPed(player), true) &&
                                !IsPedInAnyVehicle(PlayerPedId(), true)
                            ) {
                                const playerId = GetPlayerServerId(player);
                                TriggerServerEvent(ServerEvent.CUFF_PLAYER, playerId, false);
                                TriggerServerEvent(
                                    ServerEvent.MONITOR_ADD_EVENT,
                                    'job_police_cuff_player',
                                    {},
                                    { target_source: playerId, position: GetEntityCoords(GetPlayerPed(player)) },
                                    true
                                );
                            } else {
                                this.notifier.error('Vous ne pouvez pas menotter une personne dans un véhicule');
                            }
                        } else {
                            await wait(2000);
                        }
                    },
                },
                {
                    label: 'Démenotter',
                    color: job,
                    icon: 'c:police/demenotter.png',
                    item: 'handcuffs_key',
                    job: job,
                    canInteract: async entity => {
                        if (
                            !this.playerService.isOnDuty() ||
                            !IsEntityPlayingAnim(entity, 'mp_arresting', 'idle', 3) ||
                            IsPedInAnyVehicle(entity, true) ||
                            IsPedInAnyVehicle(PlayerPedId(), true)
                        ) {
                            return false;
                        }

                        const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                        return !this.playerListStateService.isZipped(target);
                    },
                    action: async entity => {
                        if (!IsPedRagdoll(PlayerPedId())) {
                            const player = NetworkGetPlayerIndexFromPed(entity);
                            if (
                                !IsPedInAnyVehicle(GetPlayerPed(player), true) &&
                                !IsPedInAnyVehicle(PlayerPedId(), true)
                            ) {
                                const playerId = GetPlayerServerId(player);
                                TriggerServerEvent(ServerEvent.UNCUFF_PLAYER, playerId);
                                TriggerServerEvent(
                                    ServerEvent.MONITOR_ADD_EVENT,
                                    'job_police_uncuff_player',
                                    {},
                                    { target_source: playerId, position: GetEntityCoords(GetPlayerPed(player)) },
                                    true
                                );
                                await wait(500);
                            } else {
                                this.notifier.error('Vous ne pouvez pas démenotter une personne dans un véhicule');
                            }
                        } else {
                            await wait(2000);
                        }
                    },
                },
            ]);
        }
        for (const job of jobsCanFouille) {
            this.targetFactory.createForAllPlayer(
                [
                    {
                        label: 'Fouiller',
                        color: job,
                        icon: 'c:police/fouiller.png',
                        job: job,
                        canInteract: entity => {
                            if (
                                this.playerService.getPlayer().job.id === JobType.CashTransfer &&
                                !this.stonkCloakRoomProvider.wearVIPClothes()
                            ) {
                                return false;
                            }
                            return (
                                this.playerService.isOnDuty() &&
                                (IsEntityPlayingAnim(entity, 'missminuteman_1ig_2', 'handsup_base', 3) ||
                                    IsEntityPlayingAnim(entity, 'mp_arresting', 'idle', 3))
                            );
                        },
                        action: async entity => {
                            await this.jobInteractionService.searchPlayer(entity);
                        },
                    },
                ],
                1.5
            );
        }
        for (const job of jobsCanEscort) {
            this.targetFactory.createForAllPlayer(
                [
                    {
                        label: 'Escorter',
                        color: job,
                        icon: 'c:police/escorter.png',
                        job: job,
                        canInteract: async entity => {
                            if (
                                this.playerService.getPlayer().job.id === JobType.CashTransfer &&
                                !this.stonkCloakRoomProvider.wearVIPClothes()
                            ) {
                                return false;
                            }
                            if (
                                !this.playerService.isOnDuty() ||
                                IsPedInAnyVehicle(entity, true) ||
                                IsPedInAnyVehicle(PlayerPedId(), true)
                            ) {
                                return false;
                            }

                            const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                            return !this.playerListStateService.isEscorted(target);
                        },
                        action: async entity => {
                            await this.jobInteractionService.escortPlayer(entity, false);
                        },
                    },
                ],
                1.5
            );
        }
        for (const job of jobsCanBreathAnalyze) {
            this.targetFactory.createForAllPlayer(
                [
                    {
                        label: 'Alcootest',
                        color: job,
                        icon: 'c:police/alcootest.png',
                        job: job,
                        item: 'breathanalyzer',
                        canInteract: () => {
                            return this.playerService.isOnDuty();
                        },
                        action: async entity => {
                            const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                            const alcoolLevel = await emitRpc<number>(RpcServerEvent.POLICE_ALCOOLLEVEL, target);
                            this.dispatcher.dispatch('police', 'OpenBreathAnalyzer', alcoolLevel / 20);
                        },
                    },
                    {
                        label: 'Dépistage de drogue',
                        color: job,
                        icon: 'c:police/screening.png',
                        job: job,
                        item: 'screening_test',
                        canInteract: () => {
                            return this.playerService.isOnDuty();
                        },
                        action: async entity => {
                            const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                            const drugLevel = await emitRpc<number>(RpcServerEvent.POLICE_DRUGLEVEL, target);
                            this.dispatcher.dispatch('police', 'OpenScreeningTest', drugLevel > 0);
                        },
                    },
                ],
                1.5
            );
        }
    }

    @OnEvent(ClientEvent.POLICE_GET_CUFFED)
    public async getCuffed(playerServerId: number) {
        const ped = PlayerPedId();
        ClearPedTasksImmediately(ped);

        this.policeAnimationProvider.getCuffed(playerServerId);
        this.phoneService.setPhoneDisabled('cuff', true);
    }

    @OnEvent(ClientEvent.POLICE_GET_UNCUFFED)
    public async getUncuffed() {
        ClearPedTasksImmediately(PlayerPedId());
        TriggerServerEvent('InteractSound_SV:PlayOnSource', 'Uncuff', 0.2);
        this.phoneService.setPhoneDisabled('cuff', false);
    }

    @OnEvent(ClientEvent.SET_ESCORTING)
    public async setEscorting(target: number, crimi: boolean) {
        const ped = PlayerPedId();
        if (crimi) {
            const animation = this.animationService.playAnimation(
                {
                    base: {
                        dictionary: 'anim@gangops@hostage@',
                        name: 'perp_idle',
                        duration: -1,
                        blendInSpeed: 4,
                        blendOutSpeed: 1,
                        options: {
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            freezeLastFrame: true,
                        },
                        playbackRate: 0,
                        lockX: false,
                        lockY: false,
                        lockZ: false,
                    },
                },
                { ped: ped }
            );
            await wait(1000);
            this.escortingAnimation = { animation, target, crimi };
        } else {
            await wait(1000);
            this.escortingAnimation = { animation: null, target, crimi };
        }
    }

    @OnEvent(ClientEvent.GET_ESCORTED)
    public async getEscorted(playerId: number, crimi: boolean) {
        const ped = PlayerPedId();
        const dragger = GetPlayerPed(GetPlayerFromServerId(playerId));

        let delta_x = 0.45;
        let delta_y = 0.45;
        let rota_z = 0;

        if (crimi) {
            delta_x = -0.3;
            delta_y = 0.08;
            rota_z = 26.1;

            ClearPedTasksImmediately(ped);
        }

        AttachEntityToEntity(
            ped,
            dragger,
            11816,
            delta_x,
            delta_y,
            0.0,
            0.0,
            0.0,
            rota_z,
            false,
            false,
            true,
            true,
            2,
            true
        );

        if (crimi) {
            await wait(100);
            const animation = this.animationService.playAnimation(
                {
                    base: {
                        dictionary: 'anim@gangops@hostage@',
                        name: 'victim_idle',
                        duration: -1,
                        blendInSpeed: 4,
                        blendOutSpeed: 1,
                        options: {
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            freezeLastFrame: true,
                        },
                        playbackRate: 0,
                        lockX: false,
                        lockY: false,
                        lockZ: false,
                    },
                },
                { ped: ped }
            );
            this.escortedAnimation = { animation, target: playerId, crimi };
        } else {
            this.escortedAnimation = { animation: null, target: playerId, crimi };
        }
    }

    @OnEvent(ClientEvent.REMOVE_ESCORTED)
    public async removeEscorted() {
        const ped = PlayerPedId();
        DetachEntity(ped, true, false);
        if (this.escortedAnimation && this.escortedAnimation.animation) {
            this.escortedAnimation.animation.cancel();
        }
        this.escortedAnimation = null;
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async manageEscorting() {
        if (!this.escortingAnimation) {
            return;
        }

        const ped = PlayerPedId();
        const player = this.playerService.getPlayer();
        const playerState = this.playerStateProvider.getState();
        if (!playerState.isEscorting) {
            return;
        }
        if (!IsPedSwimming(ped)) {
            DisableControlAction(0, 21, true);
        }
        BeginTextCommandDisplayHelp('STRING');
        AddTextComponentSubstringPlayerName('~INPUT_FRONTEND_RRIGHT~ Pour lâcher');
        EndTextCommandDisplayHelp(0, false, false, -1);

        if (
            playerState.isEscorted ||
            player.metadata.isdead ||
            player.metadata.ishandcuffed ||
            player.metadata.inlaststand ||
            IsControlJustPressed(0, 194) ||
            (!this.escortingAnimation.crimi && IsControlJustReleased(0, 255)) ||
            (this.escortingAnimation.crimi && !IsEntityPlayingAnim(ped, 'anim@gangops@hostage@', 'perp_idle', 3))
        ) {
            TriggerServerEvent(ServerEvent.REMOVE_ESCORT_PLAYER, this.escortingAnimation.target);
            TriggerServerEvent(
                ServerEvent.MONITOR_ADD_EVENT,
                'job_police_deescort_player',
                {},
                { targetSource: player.source, position: GetEntityCoords(GetPlayerPed(player.source)) },
                true
            );
            if (this.escortingAnimation.animation) {
                this.escortingAnimation.animation.cancel();
            }
            this.escortingAnimation = null;
        }
    }
}

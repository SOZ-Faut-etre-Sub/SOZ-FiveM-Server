import { AnimationService } from '@public/client/animation/animation.service';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { uuidv4, wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';

@Provider()
export class PoliceAnimationProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ClientEvent.POLICE_HANDCUFF_ANIMATION)
    public async onHandcuffAnimation() {
        const ped = PlayerPedId();
        const lib = 'mp_arrest_paired';
        const playerState = this.playerService.getState();

        TriggerServerEvent('InteractSound_SV:PlayOnSource', playerState.isHandcuffed ? 'Cuff' : 'Uncuff', 0.2);
        await wait(100);
        const animation = this.animationService.playAnimation(
            {
                base: {
                    dictionary: lib,
                    name: 'cop_p2_back_right',
                    blendInSpeed: 3.0,
                    blendOutSpeed: 3.0,
                    duration: 3500,
                    options: {
                        enablePlayerControl: true,
                        onlyUpperBody: true,
                    },
                    playbackRate: 0,
                    lockX: false,
                    lockY: false,
                    lockZ: false,
                },
            },
            { ped: ped }
        );
        TriggerServerEvent('InteractSound_SV:PlayOnSource', 'Cuff', 0.2);
        await animation;
    }

    public async getCuffed(playerServerId: number) {
        const ped = PlayerPedId();
        const lib = 'mp_arrest_paired';
        const cuffer = GetPlayerPed(GetPlayerFromServerId(playerServerId));
        const heading = GetEntityHeading(cuffer);

        TriggerServerEvent('InteractSound_SV:PlayOnSource', 'Cuff', 0.2);
        const offset = GetOffsetFromEntityInWorldCoords(cuffer, 0.0, 0.45, 0.0);
        SetEntityCoords(ped, offset[0], offset[1], offset[2], false, false, false, false);
        await wait(100);
        SetEntityHeading(ped, heading);
        const animation = this.animationService.playAnimation(
            {
                base: {
                    dictionary: lib,
                    name: 'crook_p2_back_right',
                    blendInSpeed: 3.0,
                    blendOutSpeed: 3.0,
                    duration: 3500,
                    options: {
                        enablePlayerControl: true,
                    },
                    playbackRate: 0,
                    lockX: false,
                    lockY: false,
                    lockZ: false,
                },
            },
            { ped: ped }
        );
        await animation;
    }

    @OnEvent(ClientEvent.POLICE_UNCUFF_ANIMATION)
    public async onUncuffAnimation() {
        const ped = PlayerPedId();
        const lib = 'mp_arresting';

        await wait(100);

        const animation = this.animationService.playAnimation(
            {
                base: {
                    dictionary: lib,
                    name: 'a_uncuff',
                    blendInSpeed: 8.0,
                    blendOutSpeed: -8.0,
                    duration: 3000,
                    options: {
                        onlyUpperBody: true,
                        enablePlayerControl: true,
                    },
                    playbackRate: 0,
                    lockX: false,
                    lockY: false,
                    lockZ: false,
                },
            },
            { ped: ped }
        );
        await animation;
    }

    @OnEvent(ClientEvent.POLICE_RED_CALL)
    public async redCall(societyNumber: string, msg: string, htmlMsg: string) {
        const { completed } = await this.progressService.progress('police:red-call', 'Code rouge en cours...', 5000, {
            dictionary: 'oddjobs@assassinate@guard',
            name: 'unarmed_earpiece_a',
            options: {
                onlyUpperBody: true,
                enablePlayerControl: true,
            },
        });
        if (!completed) {
            return;
        }
        TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
            anonymous: false,
            number: societyNumber,
            message: msg,
            htmlMessage: htmlMsg,
            info: { type: 'red-alert' },
            position: true,
        });
    }

    @Tick(TickInterval.EVERY_FRAME)
    public async manageCuffed() {
        const player = this.playerService.getPlayer();
        if (player && player.metadata) {
            const playerData = this.playerService.getState();
            if (playerData.isEscorted || playerData.isHandcuffed) {
                DisableAllControlActions(0);

                EnableControlAction(0, 0, true);
                EnableControlAction(0, 1, true);
                EnableControlAction(0, 2, true);

                EnableControlAction(0, 249, true);
                EnableControlAction(0, 46, true);
            }

            if (playerData.isHandcuffed) {
                EnableControlAction(0, 30, true);
                EnableControlAction(0, 31, true);

                EnableControlAction(0, 23, true);
                EnableControlAction(0, 75, true);

                if (
                    !IsEntityPlayingAnim(PlayerPedId(), 'mp_arresting', 'idle', 3) &&
                    !IsEntityPlayingAnim(PlayerPedId(), 'mp_arrest_paired', 'crook_p2_back_right', 3) &&
                    !playerData.isDead
                ) {
                    this.animationService.playAnimation(
                        {
                            base: {
                                dictionary: 'mp_arresting',
                                name: 'idle',
                                blendInSpeed: 8.0,
                                blendOutSpeed: -8.0,
                                duration: -1,
                                options: {
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    repeat: true,
                                },
                            },
                        },
                        {}
                    );
                    await wait(500);
                }
            }

            if (!playerData.isHandcuffed && !playerData.isEscorted) {
                await wait(2000);
            }
        }
    }
}

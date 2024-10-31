import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Once, OnEvent } from '@public/core/decorators/event';
import { wait } from '@public/core/utils';
import { AnimationStopReason, Vfx } from '@public/shared/animation';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { Control } from '@public/shared/input';
import { Vector3 } from '@public/shared/polyzone/vector';

import { AnimationService } from '../animation/animation.service';
import { FeatureProvider } from '../feature/feature.provider';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';
import { BlurService } from '../utils/blur.service';

@Provider()
export class BloodProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(FeatureProvider)
    public featureProvider: FeatureProvider;

    @Inject(BlurService)
    public blurService: BlurService;

    private sucked = false;

    @Once()
    public init() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            return;
        }

        this.targetFactory.createForAllPed(
            [
                {
                    label: 'Sucer',
                    category: 'citizen',
                    icon: 'halloween/sucer',
                    canInteract: entity => !IsEntityDead(entity) && !IsEntityPositionFrozen(entity),
                    action: async entity => {
                        const playerPed = PlayerPedId();
                        FreezeEntityPosition(entity, true);
                        TaskTurnPedToFaceEntity(playerPed, entity, 500);
                        await wait(500);
                        setTimeout(() => {
                            this.bloodEffect(entity);
                        }, 2000);
                        const end = await this.animationService.playAnimation({
                            base: {
                                dictionary: 'mp_ped_interaction',
                                name: 'kisses_guy_a',
                            },
                        });

                        FreezeEntityPosition(entity, false);

                        if (end != AnimationStopReason.Finished) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.HALLOWEEN_SUCK_NPC);

                        SetEntityHealth(entity, 0);
                    },
                },
            ],
            1.0
        );

        this.targetFactory.createForAllPlayer(
            [
                {
                    label: 'Sucer',
                    category: 'citizen',
                    icon: 'halloween/sucer',
                    canInteract: entity => !IsEntityDead(entity),
                    action: async entity => {
                        TriggerServerEvent(
                            ServerEvent.HALLOWEEN_SUCK_PLAYER_START,
                            GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                        );

                        const playerPed = PlayerPedId();
                        TaskTurnPedToFaceEntity(playerPed, entity, 500);
                        await wait(500);
                        const end = await this.animationService.playAnimation({
                            base: {
                                dictionary: 'mp_ped_interaction',
                                name: 'kisses_guy_a',
                            },
                        });

                        TriggerServerEvent(
                            ServerEvent.HALLOWEEN_SUCK_PLAYER_END,
                            GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)),
                            end != AnimationStopReason.Finished
                        );
                    },
                },
            ],
            1.0
        );
    }

    private bloodEffect(ped: number) {
        const fx: Vfx = {
            dictionary: 'core',
            name: 'trail_splash_blood',
            scale: 1.0,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            delay: 3_000,
        };

        const pedCoords = GetEntityCoords(ped) as Vector3;
        const playersInrange = this.playerService.getPlayersAround(pedCoords, 100.0, false);
        TriggerServerEvent(ServerEvent.ANIMATION_FX, PedToNet(ped), fx, playersInrange, GetPedBoneIndex(ped, 0x9995));
    }

    @OnEvent(ClientEvent.HALLOWEEN_SUCK_PLAYER_START)
    public async onSuckStart() {
        const end = Date.now() + 5000;
        this.sucked = true;

        setTimeout(() => {
            if (this.sucked) {
                this.bloodEffect(PlayerPedId());
                this.blurService.add('sucking', 200);
                setTimeout(() => {
                    this.blurService.remove('sucking', 200);
                }, 5000);
            }
        }, 2000);

        while (Date.now() < end && this.sucked) {
            DisableAllControlActions(0);
            EnableControlAction(0, Control.NextCamera, true);
            EnableControlAction(0, Control.LookLeftRight, true);
            EnableControlAction(0, Control.LookUpDown, true);
            EnableControlAction(0, Control.LookUpOnly, true);
            EnableControlAction(0, Control.LookDownOnly, true);
            EnableControlAction(0, Control.LookLeftOnly, true);
            EnableControlAction(0, Control.LookRightOnly, true);
            EnableControlAction(0, Control.PushToTalk, true);

            await wait(0);
        }
        this.sucked = false;
    }

    @OnEvent(ClientEvent.HALLOWEEN_SUCK_PLAYER_END)
    public async onSuckEnd(abort: boolean) {
        this.sucked = false;
        if (!abort) {
            SetPedToRagdoll(PlayerPedId(), 2000, 2000, 0, false, false, false);
        }
    }
}

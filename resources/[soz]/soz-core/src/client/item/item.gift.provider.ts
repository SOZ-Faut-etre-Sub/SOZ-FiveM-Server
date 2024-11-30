import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { AnimationService } from '@public/client/animation/animation.service';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { AnimationStopReason } from '@public/shared/animation';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Vector3 } from '@public/shared/polyzone/vector';

@Provider()
export class ItemGiftProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ClientEvent.GIFT_PLAY_JOKER_ANIM)
    public onPlayJoker() {
        this.animationService.playAnimation({
            base: {
                dictionary: 'anim@heists@humane_labs@finale@keycards',
                name: 'ped_a_enter_loop',
                options: {
                    repeat: true,
                    freezeLastFrame: true,
                },
            },
            props: [
                {
                    bone: 18905,
                    model: 'vw_prop_casino_cards_single',
                    position: [0.135, 0.07, 0.016],
                    rotation: [320, 90, 315],
                },
            ],
        });
    }

    @OnEvent(ClientEvent.GIFT_PLAY_BOUQUET_ANIM)
    public onPlayBouquet() {
        this.animationService.playAnimation({
            base: {
                dictionary: 'anim@heists@humane_labs@finale@keycards',
                name: 'ped_a_enter_loop',
                options: {
                    repeat: true,
                    freezeLastFrame: true,
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                },
            },
            props: [
                {
                    bone: 18905,
                    model: 'prop_snow_flower_02',
                    position: [0.09, 0.01, 0.01],
                    rotation: [320, 45, 315],
                },
            ],
        });
    }

    @OnEvent(ClientEvent.GIFT_PLAY_TOKEN_ANIM)
    public async onPlayToken() {
        const reason = await this.animationService.playAnimation({
            base: {
                dictionary: 'anim@mp_player_intcelebrationmale@coin_roll_and_toss',
                name: 'coin_roll_and_toss',
            },
        });

        if (reason != AnimationStopReason.Finished) {
            return;
        }

        const aroundPlayers = this.playerService.getPlayersAround(GetEntityCoords(PlayerPedId()) as Vector3, 2.0);
        TriggerServerEvent(ServerEvent.GIFT_TOSS_COIN, aroundPlayers);
    }

    @OnEvent(ClientEvent.GIFT_PLAY_GIFT_ANIM)
    public async onPlayGift(slot: number, name: string) {
        const { completed } = await this.progressService.progress('open-gift', 'Ouverture du cadeau...', 5000, {
            dictionary: 'anim@heists@humane_labs@emp@hack_door',
            name: 'hack_loop',
            options: {
                repeat: true,
                onlyUpperBody: true,
                enablePlayerControl: true,
            },
            props: [
                {
                    bone: 28422,
                    model: 'xm3_prop_xm3_present_01a',
                    position: [0.15, 0.0, 0.0],
                    rotation: [0.0, 270.0, 0.0],
                },
            ],
        });

        if (completed) {
            TriggerServerEvent(ServerEvent.GIFT_OPEN_GIFT, slot, name);
        }
    }
}

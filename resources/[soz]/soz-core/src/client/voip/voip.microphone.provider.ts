import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { AnimationService } from '../animation/animation.service';
import { PlayerService } from '../player/player.service';
import { VoipService } from './voip.service';

@Provider()
export class VoipMicrophoneProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VoipService)
    private voipService: VoipService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private microphoneInUse = false;

    @OnEvent(ClientEvent.VOIP_ITEM_MICROPHONE_TOGGLE)
    public onMicrophoneToggle() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (
            player.metadata.isdead ||
            player.metadata.ishandcuffed ||
            player.metadata.inlaststand ||
            IsPauseMenuActive()
        ) {
            return;
        }

        this.microphoneInUse = !this.microphoneInUse;
        this.voipService.setPlayerMicrophoneInUse(this.microphoneInUse);

        if (this.microphoneInUse) {
            this.animationService.playAnimationIfNotRunning({
                base: {
                    dictionary: 'anim@mp_player_intselfiethumbs_up',
                    name: 'idle_a',
                    options: {
                        repeat: true,
                        onlyUpperBody: true,
                        enablePlayerControl: true,
                    },
                },
                props: [
                    {
                        model: 'prop_microphone_02',
                        bone: 36029,
                        position: [0.08, 0.025, 0.034],
                        rotation: [30.0, 95.0, 50.0],
                    },
                ],
            });
        } else {
            this.animationService.stopAnimationIfRunning({
                base: {
                    dictionary: 'anim@mp_player_intselfiethumbs_up',
                    name: 'idle_a',
                },
            });
        }
    }
}

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AnimationStopReason } from '../../shared/animation';
import { ClientEvent } from '../../shared/event';
import { JobType } from '../../shared/job';
import { Vector3 } from '../../shared/polyzone/vector';
import { getRandomItem } from '../../shared/random';
import { AnimationRunner } from '../animation/animation.factory';
import { AnimationService } from '../animation/animation.service';
import { PlayerService } from '../player/player.service';
import { VoipService } from '../voip/voip.service';

const Config = {
    microphone: {
        prop: { [JobType.News]: 'p_ing_microphonel_01', [JobType.YouNews]: 'soz_p_ing_microphonel_01' },
        dictionary: 'anim@mp_player_intselfiethumbs_up',
        animation: 'idle_a',
        boneIndex: 36029,
        bonePosition: [0.08, 0.025, 0.034] as Vector3,
        boneRotation: [30.0, 95.0, 50.0] as Vector3,
        // rotationOrder: 2,
    },
    big_microphone: {
        prop: { [JobType.News]: 'prop_v_bmike_01', [JobType.YouNews]: 'prop_v_bmike_01' },
        dictionary: 'missfra1',
        animation: 'mcs2_crew_idle_m_boom',
        boneIndex: 28422,
        bonePosition: [-0.08, 0.0, 0.0] as Vector3,
        boneRotation: [0.0, 0.0, 0.0] as Vector3,
        // rotationOrder: 0,
    },
};

@Provider()
export class ItemMicrophoneProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(VoipService)
    private voipService: VoipService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private typeUsing: keyof typeof Config = null;

    private currentAnimation: AnimationRunner = null;

    @OnEvent(ClientEvent.ITEM_MICROPHONE_TOGGLE)
    public async onToggleMicrophone(type: keyof typeof Config) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (this.currentAnimation) {
            this.currentAnimation.cancel(AnimationStopReason.Canceled);

            if (this.typeUsing === type || type === null) {
                this.typeUsing = null;

                return;
            }
        }

        const prop = Config[type].prop[player.job.id] || getRandomItem(Object.values(Config[type].prop));
        this.typeUsing = type;
        const config = Config[type];

        this.currentAnimation = this.animationService.playAnimation(
            {
                base: {
                    dictionary: config.dictionary,
                    name: config.animation,
                    duration: -1,
                    options: {
                        freezeLastFrame: true,
                        enablePlayerControl: true,
                        onlyUpperBody: true,
                    },
                    lockX: false,
                    lockY: false,
                    lockZ: false,
                },
                props: [
                    {
                        bone: config.boneIndex,
                        position: config.bonePosition,
                        rotation: config.boneRotation,
                        model: prop,
                    },
                ],
            },
            {
                resetWeapon: true,
            }
        );

        if (type === 'microphone') {
            this.voipService.setPlayerMicrophoneInUse(true);
        }

        await this.currentAnimation;

        if (type === 'microphone') {
            this.voipService.setPlayerMicrophoneInUse(false);
        }

        this.currentAnimation = null;
    }
}

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { AnimationService } from '../animation/animation.service';
import { PlayerService } from '../player/player.service';
import { VoipService } from './voip.service';

@Provider()
export class VoipMegaphoneProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VoipService)
    private voipService: VoipService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private megaphoneInUse = false;

    @OnEvent(ClientEvent.VOIP_ITEM_MEGAPHONE_TOGGLE)
    public onMegaphoneToggle() {
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

        this.megaphoneInUse = !this.megaphoneInUse;
        this.voipService.setPlayerMegaphoneInUse(this.megaphoneInUse);

        if (this.megaphoneInUse) {
            this.animationService.playAnimationIfNotRunning({
                base: {
                    dictionary: 'anim@random@shop_clothes@watches',
                    name: 'base',
                    options: {
                        repeat: true,
                        onlyUpperBody: true,
                        enablePlayerControl: true,
                    },
                },
                props: [
                    {
                        model: 'prop_megaphone_01',
                        bone: 60309,
                        position: [0.1, 0.05, 0.012],
                        rotation: [20.0, 110.0, 70.0],
                    },
                ],
            });
        } else {
            this.animationService.stopAnimationIfRunning({
                base: {
                    dictionary: 'anim@random@shop_clothes@watches',
                    name: 'base',
                },
            });
        }
    }
}

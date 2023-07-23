import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { PlayerService } from '../player/player.service';
import { AnimationService } from './animation.service';

@Provider()
export class AnimationRagdollProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private ragdoll = false;

    @Command('animation_ragdoll', {
        description: 'Ragdoll',
        keys: [
            {
                mapper: 'keyboard',
                key: 'Z',
            },
        ],
    })
    public async toggleRagdoll() {
        if (this.ragdoll) {
            this.ragdoll = false;
            return;
        }

        if (!this.playerService.canDoAction()) {
            return;
        }

        const ped = PlayerPedId();

        if (IsPedInAnyVehicle(ped, false)) {
            return;
        }

        this.ragdoll = true;

        while (this.ragdoll) {
            SetPedToRagdoll(PlayerPedId(), 1000, 1000, 0, false, false, false);
            await wait(100);
        }
    }
}

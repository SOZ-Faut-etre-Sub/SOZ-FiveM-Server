import { MinigameProvider } from '@private/client/minigames/minigames.provider';
import { AnimationService } from '@public/client/animation/animation.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { ServerEvent } from '@public/shared/event';
import { ALL_FDO_JOB_TARGETS, JobType } from '@public/shared/job';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { RpcServerEvent } from '@public/shared/rpc';

const zone = new BoxZone([1143.21, -428.78, 72.54], 0.4, 0.4, {
    heading: -19.99,
    minZ: 72.34,
    maxZ: 72.74,
});

@Provider()
export class PoliceSecretProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(MinigameProvider)
    private minigameService: MinigameProvider;

    @Once()
    public onStart() {
        this.targetFactory.createForBoxZone(
            'mppd_secret',
            zone,
            [
                {
                    label: 'Ordinateur',
                    icon: 'vehbiz/hacking',
                    job: ALL_FDO_JOB_TARGETS,
                    blackoutJob: JobType.LSPD,
                    blackoutGlobal: true,
                    category: 'society',
                    action: async () => {
                        const canDo = await emitRpc<boolean>(RpcServerEvent.POLICE_SECRET_CHECK);
                        if (!canDo) {
                            return;
                        }

                        const anim = this.animationService.playAnimation({
                            base: {
                                dictionary: 'mp_fib_grab',
                                name: 'loop',
                                options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
                            },
                        });

                        const success = await this.minigameService.runGame('ShowPincraker', {
                            nbDigit: 8,
                            delay: 60,
                        });

                        TriggerServerEvent(ServerEvent.POLICE_SECRET, success);
                        anim.cancel();
                    },
                },
            ],
            1.5
        );
    }
}

import { Exportable } from '@public/core/decorators/exports';
import { animationFlagsToOptions } from '@public/shared/animation';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { ProgressAnimation, ProgressOptions, ProgressProp } from '../../shared/progress';
import { ProgressService } from '../progress.service';

@Provider()
export class ProgressProvider {
    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ClientEvent.PROGRESS_START)
    async progress(
        id: string,
        name: string,
        label: string,
        duration: number,
        animation: ProgressAnimation,
        options: ProgressOptions
    ): Promise<void> {
        if (options.headingEntity) {
            options.headingEntity.entity = NetworkGetEntityFromNetworkId(options.headingEntity.entity);
        }

        const result = await this.progressService.progress(name, label, duration, animation, options);

        TriggerServerEvent(ServerEvent.PROGRESS_FINISH, id, result);
    }

    @OnEvent(ClientEvent.PROGRESS_STOP)
    async progressStop(): Promise<void> {
        await this.progressService.cancel();
    }

    @Exportable('ProgressSynchrone')
    public async progressSynchrone(
        name: string,
        label: string,
        duration: number,
        useWhileDead: boolean,
        canCancel: boolean,
        disableControls,
        animation,
        prop: ProgressProp,
        propTwo: ProgressProp
    ) {
        try {
            const result = await this.progressService.progress(
                name.toLowerCase(),
                label,
                duration,
                {
                    task: animation.task,
                    dictionary: animation.animDict,
                    name: animation.anim,
                    options: animationFlagsToOptions(animation.flags),
                },
                {
                    useAnimationService: true,
                    useWhileDead: useWhileDead,
                    canCancel: canCancel,
                    disableCarMovement: disableControls.disableCarMovement,
                    disableCombat: disableControls.disableCombat,
                    disableMovement: disableControls.disableMovement,
                    disableMouse: disableControls.disableMouse,
                    firstProp: prop,
                    secondProp: propTwo,
                }
            );
            return result.completed;
        } catch (e) {
            console.log(e);
        }
    }
}

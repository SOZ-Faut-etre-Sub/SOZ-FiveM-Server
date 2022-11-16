import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { ProgressAnimation, ProgressOptions } from '../../shared/progress';
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
}

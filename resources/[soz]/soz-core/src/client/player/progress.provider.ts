import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';
import { ProgressAnimation, ProgressOptions } from '../../shared/progress';
import { ProgressService } from '../progress.service';

@Provider()
export class ProgressProvider {
    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @On('soz-core:client:progress:start')
    async progress(
        id: string,
        name: string,
        label: string,
        duration: number,
        animation: ProgressAnimation,
        options: ProgressOptions
    ): Promise<void> {
        const result = await this.progressService.progress(name, label, duration, animation, options);

        TriggerServerEvent('soz-core:server:progress:finish', id, result);
    }
}

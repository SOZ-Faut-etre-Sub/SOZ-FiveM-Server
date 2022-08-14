import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { uuidv4 } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { ProgressAnimation, ProgressOptions, ProgressResult } from '../../shared/progress';

@Provider()
export class ProgressService {
    private promises: Record<string, (result: ProgressResult) => void> = {};

    public async progress(
        player: number,
        name: string,
        label: string,
        duration: number,
        animation: ProgressAnimation,
        options: Partial<ProgressOptions> = {}
    ): Promise<ProgressResult> {
        let promiseResolve, promiseReject;

        const id = uuidv4();
        const promise = new Promise<ProgressResult>(function (resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
        });

        this.promises[id] = promiseResolve;

        setTimeout(() => {
            if (this.promises[id]) {
                delete this.promises[id];

                promiseReject('progress timeout after ' + duration * 2 + 'ms');
            }
        }, duration * 2);

        TriggerClientEvent(ClientEvent.PROGRESS_START, player, id, name, label, duration, animation, options);

        return promise;
    }

    @OnEvent(ServerEvent.PROGRESS_FINISH)
    public onProgressFinish(player: number, id: string, result: ProgressResult): void {
        if (this.promises[id]) {
            this.promises[id](result);

            delete this.promises[id];
        }
    }
}

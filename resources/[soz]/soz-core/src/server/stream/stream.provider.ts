import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { BLACK_SCREEN_URL } from '../../shared/global';
import { Store } from '../store/store';

@Provider()
export class StreamProvider {
    @Inject('Store')
    private store: Store;

    @Command('stream-url', { role: ['staff', 'admin'] })
    setStreamUrlCommand(source: number, stream: string, url = ''): void {
        this.store.dispatch.global.setStreamUrl({ stream, url });
    }

    @Command('stream-stop', { role: ['staff', 'admin'] })
    stopStreamCommand(source: number, stream: string): void {
        this.store.dispatch.global.setStreamUrl({ stream, url: BLACK_SCREEN_URL });
    }
}

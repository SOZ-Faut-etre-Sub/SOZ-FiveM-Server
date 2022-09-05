import { Command } from '../../core/decorators/command';
import { Provider } from '../../core/decorators/provider';

@Provider()
export class StreamProvider {
    @Command('cinema-url', { role: 'admin' })
    setCinemaUrlCommand(source: number, url = ''): void {
        GlobalState.cinema_url = url;
    }

    @Command('cinema-stop', { role: 'admin' })
    stopCinemaCommand(): void {
        GlobalState.cinema_url = 'nui://soz-core/public/dui_twitch_stream.html';
    }
}

import { Command } from '../../core/decorators/command';
import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';

const BLACK_SCREEN_URL = 'nui://soz-core/public/dui_twitch_stream.html';

@Provider()
export class StreamProvider {
    @Once()
    onStart(): void {
        GlobalState.stream_url_bennys ||= BLACK_SCREEN_URL;
        GlobalState.stream_url_cinema ||= BLACK_SCREEN_URL;
    }

    @Command('stream-url', { role: 'admin' })
    setStreamUrlCommand(source: number, name: string, url = ''): void {
        name = name.toLowerCase();

        if (name === 'bennys') {
            GlobalState.stream_url_bennys = url;
        } else if (name === 'cinema') {
            GlobalState.stream_url_cinema = url;
        } else {
            console.log(`Stream inconnu: ${name}`);
        }
    }

    @Command('stream-stop', { role: 'admin' })
    stopStreamCommand(source: number, name: string): void {
        name = name.toLowerCase();

        if (name === 'bennys') {
            GlobalState.stream_url_bennys = BLACK_SCREEN_URL;
        } else if (name === 'cinema') {
            GlobalState.stream_url_cinema = BLACK_SCREEN_URL;
        } else {
            console.log(`Stream inconnu: ${name}`);
        }
    }
}

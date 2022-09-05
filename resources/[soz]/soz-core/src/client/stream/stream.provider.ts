import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { BLACK_SCREEN_URL, StreamScreen } from './stream.screen';

@Provider()
export class StreamProvider {
    private cinemaScreen: StreamScreen;

    private bennysScreen: StreamScreen;

    @Once()
    async onStart(): Promise<void> {
        this.cinemaScreen = new StreamScreen(
            new BoxZone([344.41, 208.8, 103.02], 44.15, 44.2, {
                maxZ: 103.02 + 20,
                minZ: 103.02 - 1,
            }),
            'cinema',
            'v_ilev_cin_screen',
            'cinscreen'
        );

        this.bennysScreen = new StreamScreen(
            new BoxZone([-187.83, -1280.81, 31.3], 58.6, 75.2, {
                maxZ: 31.02 + 20,
                minZ: 31.02 - 1,
            }),
            'bennys',
            'soz_big_screenbenny',
            'cinscreen'
        );
    }

    @Tick(TickInterval.EVERY_SECOND)
    async updateUrl() {
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;

        this.cinemaScreen.update(position, GlobalState.stream_url_cinema || BLACK_SCREEN_URL);
        this.bennysScreen.update(position, GlobalState.stream_url_bennys || BLACK_SCREEN_URL);
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onTick(): Promise<void> {
        this.cinemaScreen.stream();
        this.bennysScreen.stream();
    }
}

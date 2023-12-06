import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { Store } from '../store/store';
import { StreamScreen } from './stream.screen';

@Provider()
export class StreamProvider {
    @Inject('Store')
    private store: Store;

    private cinemaScreen: StreamScreen;

    private bennysScreen: StreamScreen;

    @Once()
    async onStart(): Promise<void> {
        this.cinemaScreen = new StreamScreen(
            new BoxZone([344.41, 208.8, 103.02], 44.15, 44.2, {
                maxZ: 103.02 + 20,
                minZ: 103.02 - 1,
                heading: 340,
            }),
            'cinema',
            'soz_v_50_floornwalls',
            'big_disp2'
        );

        this.bennysScreen = new StreamScreen(
            new BoxZone([-187.83, -1280.81, 31.3], 80.6, 80.2, {
                maxZ: 31.02 + 20,
                minZ: 31.02 - 1,
            }),
            'bennys',
            'soz_big_screenbenny',
            'big_disp'
        );
    }

    @Tick(TickInterval.EVERY_SECOND)
    async updateUrl() {
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const streamUrls = this.store.getState().global.streamUrls;

        this.cinemaScreen.update(position, streamUrls.cinema);
        this.bennysScreen.update(position, streamUrls.bennys);
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onTick(): Promise<void> {
        this.cinemaScreen.stream();
        this.bennysScreen.stream();
    }
}

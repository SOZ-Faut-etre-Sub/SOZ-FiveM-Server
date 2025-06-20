import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { BLACK_SCREEN_URL } from '../../shared/global';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { Store } from '../store/store';
import { StreamScreen } from './stream.screen';

@Provider()
export class StreamProvider {
    @Inject('Store')
    private store: Store;

    public videoVolume: number = 0.5;

    private cinemaScreen: StreamScreen;
    private bennysScreen: StreamScreen;
    private lspdScreen: StreamScreen;
    private fdlmScreen: StreamScreen;

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

        this.lspdScreen = new StreamScreen(
            new BoxZone([1158.56, -469.22, 63.39], 98.4, 94.0, {
                heading: 164.99,
                minZ: 62.39,
                maxZ: 83.19,
            }),
            'lspd',
            'soz_big_screenbenny',
            'big_disp'
        );

        this.fdlmScreen = new StreamScreen(
            new BoxZone([-1465.36, -1240.18, 16.85], 148.6, 105.0, {
                heading: 201.1,
                minZ: 1.85,
                maxZ: 26.65,
            }),
            'fdlm',
            'soz_fdlm_scene_animation',
            'big_disp'
        );
    }

    @Tick(TickInterval.EVERY_SECOND)
    async updateUrl() {
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const streamUrls = this.store.getState().global.streamUrls;

        this.cinemaScreen.update(position, streamUrls.cinema || BLACK_SCREEN_URL, this.videoVolume);
        this.bennysScreen.update(position, streamUrls.bennys || BLACK_SCREEN_URL, this.videoVolume);
        this.lspdScreen.update(position, streamUrls.lspd || BLACK_SCREEN_URL, this.videoVolume);
        this.fdlmScreen.update(position, streamUrls.fdlm || BLACK_SCREEN_URL, this.videoVolume);
    }

    setVideoVolume(volume: number) {
        this.videoVolume = volume;
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onTick(): Promise<void> {
        this.cinemaScreen.stream();
        this.bennysScreen.stream();
        this.lspdScreen.stream();
        this.fdlmScreen.stream();
    }
}

import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';

const BLACK_URL = 'nui://soz-core/public/dui_twitch_stream.html';

@Provider()
export class StreamProvider {
    private duiObject: number;

    private handle: number | null = null;

    private url = BLACK_URL;

    private playingUrl = BLACK_URL;

    private zone = new BoxZone([344.41, 208.8, 103.02], 44.15, 44.2, {
        maxZ: 103.02 + 20,
        minZ: 103.02 - 1,
    });

    @Once()
    async onStart(): Promise<void> {
        const texture = CreateRuntimeTxd('video_dict');
        this.duiObject = CreateDui(this.playingUrl, 1280, 720);
        const duiHandle = GetDuiHandle(this.duiObject);
        CreateRuntimeTextureFromDuiHandle(texture, 'video_texture', duiHandle);

        const screenModel = GetHashKey('v_ilev_cin_screen');
        this.handle = this.createNamedRenderTargetForModel('cinscreen', screenModel);

        if (GlobalState.cinema_url) {
            this.url = GlobalState.cinema_url;
        }
    }

    @StateBagHandler('cinema_url', 'global')
    async onCinemaUrlChange(_name, _key, url: string) {
        this.url = url;
    }

    @Tick(TickInterval.EVERY_SECOND)
    async updateUrl() {
        const position = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const inside = this.zone.isPointInside(position);

        if (!inside && this.playingUrl === BLACK_URL) {
            return;
        }

        if (!inside) {
            this.playingUrl = BLACK_URL;
        }

        if (this.playingUrl === this.url) {
            return;
        }

        if (inside) {
            this.playingUrl = this.url;
        }

        SetDuiUrl(this.duiObject, this.playingUrl);
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onTick(): Promise<void> {
        if (!this.handle || this.playingUrl === BLACK_URL) {
            return;
        }

        SetTextRenderId(this.handle);
        Set_2dLayer(4);
        SetScriptGfxDrawBehindPausemenu(true);
        DrawRect(0.5, 0.5, 1.0, 1.0, 0, 0, 0, 255);
        DrawSprite('video_dict', 'video_texture', 0.5, 0.5, 1.0, 1.0, 0.0, 255, 255, 255, 255);
        SetTextRenderId(GetDefaultScriptRendertargetRenderId());
        SetScriptGfxDrawBehindPausemenu(false);
    }

    private createNamedRenderTargetForModel(name, model): number {
        let handle = 0;

        if (!IsNamedRendertargetRegistered(name)) {
            RegisterNamedRendertarget(name, false);
        }

        if (!IsNamedRendertargetLinked(model)) {
            LinkNamedRendertarget(model);
        }

        if (IsNamedRendertargetRegistered(name)) {
            handle = GetNamedRendertargetRenderId(name);
        }

        return handle;
    }
}

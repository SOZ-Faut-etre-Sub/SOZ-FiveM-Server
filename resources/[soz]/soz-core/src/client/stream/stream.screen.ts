import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';

export const BLACK_SCREEN_URL = 'nui://soz-core/public/dui_twitch_stream.html';

const createNamedRenderTargetForModel = (name, model): number => {
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
};

export class StreamScreen {
    private readonly duiObject: number;

    private readonly textureDictionary: string;

    private readonly textureName: string;

    private readonly renderTarget: string;

    private handle: number | null = null;

    private playingUrl = BLACK_SCREEN_URL;

    private zone: BoxZone;

    public constructor(
        zone: BoxZone,
        name: string,
        model: string,
        renderTarget = 'cinscreen',
        width = 4096,
        height = 2048
    ) {
        this.textureDictionary = name + '_dict';
        this.textureName = 'video';
        this.zone = zone;
        this.renderTarget = renderTarget;

        this.duiObject = CreateDui(this.playingUrl, width, height);

        CreateRuntimeTextureFromDuiHandle(
            CreateRuntimeTxd(this.textureDictionary),
            this.textureName,
            GetDuiHandle(this.duiObject)
        );

        this.handle = createNamedRenderTargetForModel(this.renderTarget, GetHashKey(model));
    }

    public update(position: Vector3, url: string) {
        const inside = this.zone.isPointInside(position);

        if (!inside && this.playingUrl === BLACK_SCREEN_URL) {
            return;
        }

        if (!inside) {
            this.playingUrl = BLACK_SCREEN_URL;
        }

        if (this.playingUrl === url) {
            return;
        }

        if (inside) {
            this.playingUrl = url;
        }

        SetDuiUrl(this.duiObject, this.playingUrl);
    }

    public stream() {
        if (!this.handle || this.playingUrl === BLACK_SCREEN_URL) {
            return;
        }

        SetTextRenderId(this.handle);
        SetScriptGfxDrawOrder(4);
        SetScriptGfxDrawBehindPausemenu(true);
        DrawSprite(this.textureDictionary, this.textureName, 0.5, 0.5, 1.0, 1.0, 0.0, 255, 255, 255, 255);
        SetTextRenderId(GetDefaultScriptRendertargetRenderId());
        SetScriptGfxDrawBehindPausemenu(false);
    }

    public unload() {
        this.handle = null;

        DestroyDui(this.duiObject);
        ReleaseNamedRendertarget(this.renderTarget);
    }
}

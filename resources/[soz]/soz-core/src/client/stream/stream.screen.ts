import { BLACK_SCREEN_URL } from '../../shared/global';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { createNamedRenderTargetForModel, releaseNamedRenderTarget } from '../render.target';

export class StreamScreen {
    private readonly duiObject: number;

    private readonly textureDictionary: string;

    private readonly textureName: string;

    private readonly renderTarget: string;

    private readonly model: string;

    private handle: number | null = null;

    private playingUrl = BLACK_SCREEN_URL;

    private zone: BoxZone;

    private volume: number;

    public constructor(
        zone: BoxZone,
        name: string,
        model: string,
        renderTarget = 'cinscreen',
        width = 4096,
        height = 2048,
        volume = 0.5
    ) {
        this.textureDictionary = name + '_dict';
        this.textureName = 'video';
        this.zone = zone;
        this.renderTarget = renderTarget;
        this.model = model;
        this.handle = null;
        this.volume = volume;

        this.duiObject = CreateDui(this.playingUrl, width, height);

        CreateRuntimeTextureFromDuiHandle(
            CreateRuntimeTxd(this.textureDictionary),
            this.textureName,
            GetDuiHandle(this.duiObject)
        );
    }

    public createHandle() {
        this.handle = createNamedRenderTargetForModel(this.renderTarget, GetHashKey(this.model));
    }

    public update(position: Vector3, url: string, volume: number) {
        const inside = this.zone.isPointInside(position);

        if (!inside) {
            if (this.handle) {
                ReleaseNamedRendertarget(this.renderTarget);
                this.handle = null;
            }

            if (this.playingUrl !== BLACK_SCREEN_URL) {
                this.playingUrl = BLACK_SCREEN_URL;
                SetDuiUrl(this.duiObject, this.playingUrl);
            }

            return;
        }

        if (!this.handle) {
            this.createHandle();
        }

        if (this.playingUrl === url) {
            SendDuiMessage(
                this.duiObject,
                JSON.stringify({
                    volume: volume,
                })
            );

            return;
        }

        this.playingUrl = url;
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
        releaseNamedRenderTarget(this.renderTarget);
    }
}

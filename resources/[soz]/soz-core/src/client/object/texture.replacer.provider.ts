import { OnNuiEvent } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { Inject } from '@public/core/decorators/injectable';
import { TextureReplacement } from '@public/shared/image.loader';

import { NuiEvent } from '../../shared/event';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class TextureReplacerProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private textureDict = CreateRuntimeTxd(`dynamic_prop_textures`);

    private loadedTexture: string[] = [];
    private waitingReplcament = new Map<string, TextureReplacement[]>();
    private waitingLoad: string[] = [];
    private loadingTexture: {
        length: number;
        chunks: string[];
    };

    @OnNuiEvent(NuiEvent.TextureReplacerChunk)
    public async addCustomTextureChunk({
        url,
        index,
        maxIndex,
        chunk,
    }: {
        url: string;
        index: number;
        maxIndex: number;
        chunk: string;
    }) {
        if (this.loadedTexture.includes(url)) {
            return;
        }

        if (!this.loadingTexture) {
            return;
        }

        this.loadingTexture.chunks[index] = chunk;
        this.loadingTexture.length++;

        if (this.loadingTexture.length === maxIndex + 1) {
            const file = this.loadingTexture.chunks.join('');

            CreateRuntimeTextureFromImage(this.textureDict, url, file);
            this.loadedTexture.push(url);
            delete this.loadingTexture;

            const waitings = this.waitingReplcament.get(url);
            if (waitings) {
                for (const waiting of waitings) {
                    AddReplaceTexture(waiting.baseDict, waiting.baseTexture, `dynamic_prop_textures`, url);
                }
                this.waitingReplcament.delete(url);
            }

            const next = this.waitingLoad.pop();
            if (next) {
                this.loadingTexture = {
                    length: 0,
                    chunks: [],
                };
                this.nuiDispatch.dispatch('texture', 'loadImage', next);
            }
        }
    }

    public replaceTexture(replacement: TextureReplacement) {
        if (this.loadedTexture.includes(replacement.url)) {
            AddReplaceTexture(replacement.baseDict, replacement.baseTexture, `dynamic_prop_textures`, replacement.url);
            return;
        }

        let waitings = this.waitingReplcament.get(replacement.url);
        if (!waitings) {
            waitings = [];
            this.waitingReplcament.set(replacement.url, waitings);
        }

        waitings.push(replacement);
        if (!this.loadingTexture) {
            this.loadingTexture = {
                length: 0,
                chunks: [],
            };
            this.nuiDispatch.dispatch('texture', 'loadImage', replacement.url);
        } else {
            this.waitingLoad.push(replacement.url);
        }
    }
}

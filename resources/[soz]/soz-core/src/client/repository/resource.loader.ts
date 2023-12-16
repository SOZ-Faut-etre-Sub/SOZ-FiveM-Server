import { Logger } from '@public/core/logger';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { wait } from '../../core/utils';

@Injectable()
export class ResourceLoader {
    @Inject(Logger)
    public logger: Logger;

    async loadPtfxAsset(name: string): Promise<void> {
        if (!HasNamedPtfxAssetLoaded(name)) {
            RequestNamedPtfxAsset(name);

            while (!HasNamedPtfxAssetLoaded(name)) {
                await wait(0);
            }
        }
    }

    unloadPtfxAsset(name: string): void {
        RemoveNamedPtfxAsset(name);
    }

    async loadAnimationDictionary(name: string): Promise<void> {
        if (!HasAnimDictLoaded(name)) {
            RequestAnimDict(name);

            while (!HasAnimDictLoaded(name)) {
                await wait(0);
            }
        }
    }

    unloadAnimationDictionary(name: string): void {
        RemoveAnimDict(name);
    }

    async loadAnimationSet(name: string): Promise<void> {
        if (!HasAnimSetLoaded(name)) {
            RequestAnimSet(name);

            while (!HasAnimSetLoaded(name)) {
                await wait(0);
            }
        }
    }

    unloadAnimationSet(name: string): void {
        RemoveAnimSet(name);
    }

    async loadModel(name: string | number): Promise<boolean> {
        const start = Date.now();
        if (!HasModelLoaded(name)) {
            RequestModel(name);

            while (!HasModelLoaded(name)) {
                if (Date.now() > start + 60000) {
                    this.logger.error('Failed to load model ' + name);
                    return false;
                }
                await wait(0);
            }
        }

        return true;
    }

    unloadModel(name: string | number): void {
        SetModelAsNoLongerNeeded(name);
    }

    async requestScriptAudioBank(name: string): Promise<void> {
        while (!RequestScriptAudioBank(name, false)) {
            await wait(100);
        }
    }

    async loadScaleformMovie(name: string) {
        const scaleform = RequestScaleformMovie(name);
        while (!HasScaleformMovieLoaded(scaleform)) {
            await wait(0);
        }
        return scaleform;
    }

    async loadStreamedTextureDict(name: string): Promise<void> {
        if (!HasStreamedTextureDictLoaded(name)) {
            RequestStreamedTextureDict(name, true);

            while (!HasStreamedTextureDictLoaded(name)) {
                await wait(0);
            }
        }
    }
}

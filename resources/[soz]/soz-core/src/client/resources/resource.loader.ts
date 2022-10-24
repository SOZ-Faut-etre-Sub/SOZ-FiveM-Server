import { Injectable } from '../../core/decorators/injectable';
import { wait } from '../../core/utils';

@Injectable()
export class ResourceLoader {
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

    async loadAnimationSet(name: string): Promise<void> {
        if (!HasAnimSetLoaded(name)) {
            RequestAnimSet(name);

            while (!HasAnimSetLoaded(name)) {
                await wait(0);
            }
        }
    }

    unloadedAnimationSet(name: string): void {
        RemoveAnimSet(name);
    }

    async loadModel(name: string | number): Promise<void> {
        if (!HasModelLoaded(name)) {
            RequestModel(name);

            while (!HasModelLoaded(name)) {
                await wait(0);
            }
        }
    }

    unloadModel(name: string): void {
        SetModelAsNoLongerNeeded(name);
    }
}

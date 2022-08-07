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

    unloadedPtfxAsset(name: string): void {
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
}

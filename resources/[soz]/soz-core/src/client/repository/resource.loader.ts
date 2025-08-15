import { Inject, Injectable } from '@core/decorators/injectable';
import { wait, waitUntil } from '@core/utils';
import { Logger } from '@public/core/logger';

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

    async loadStream(streamName: string, soundSet: string): Promise<void> {
        LoadStream(streamName, soundSet);
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

    unloadScriptAudioBank(name: string): void {
        ReleaseNamedScriptAudioBank(name);
    }

    async loadScaleformMovie(name: string) {
        const scaleform = RequestScaleformMovie(name);
        while (!HasScaleformMovieLoaded(scaleform)) {
            await wait(0);
        }
        return scaleform;
    }

    async loadScaleformMovieWithIgnoreSuperWidescreen(name: string) {
        const scaleform = RequestScaleformMovieWithIgnoreSuperWidescreen(name);
        while (!HasScaleformMovieLoaded(scaleform)) {
            await wait(0);
        }
        SetScaleformMovieToUseSuperLargeRt(scaleform, true);
        return scaleform;
    }

    async unloadScaleformMovie(scaleform: number) {
        if (!HasScaleformMovieLoaded(scaleform)) {
            return;
        }
        SetScaleformMovieAsNoLongerNeeded(scaleform);
    }

    public async scaleformGetValueInt(scaleform: number, method: string) {
        BeginScaleformMovieMethod(scaleform, method);
        const handle = EndScaleformMovieMethodReturnValue();

        await waitUntil(async () => IsScaleformMovieMethodReturnValueReady(handle), 1000);

        return GetScaleformMovieMethodReturnValueInt(handle);
    }

    public scaleformPushString(scaleform: number, method: string, val: string) {
        PushScaleformMovieFunction(scaleform, method);
        PushScaleformMovieFunctionParameterString(val);
        PopScaleformMovieFunctionVoid();
    }

    public scaleformPushArgInt(scaleform: number, method: string, val: number) {
        PushScaleformMovieFunction(scaleform, method);
        PushScaleformMovieFunctionParameterInt(val);
        PopScaleformMovieFunctionVoid();
    }

    public scaleformPushArgFloat(scaleform: number, method: string, val: number) {
        PushScaleformMovieFunction(scaleform, method);
        PushScaleformMovieFunctionParameterFloat(val);
        PopScaleformMovieFunctionVoid();
    }

    public scaleformPushArgBool(scaleform: number, method: string, val: boolean) {
        PushScaleformMovieFunction(scaleform, method);
        PushScaleformMovieFunctionParameterBool(val);
        PopScaleformMovieFunctionVoid();
    }

    public scaleformPushArgMulti(scaleform: number, method: string, vals: any[]) {
        PushScaleformMovieFunction(scaleform, method);
        for (const val of vals) {
            if (typeof val == 'string') {
                PushScaleformMovieFunctionParameterString(val);
            } else if (typeof val == 'boolean') {
                PushScaleformMovieFunctionParameterBool(val);
            } else if (typeof val == 'number') {
                if (val % 1 === 0) {
                    PushScaleformMovieFunctionParameterInt(val);
                } else {
                    PushScaleformMovieFunctionParameterFloat(val);
                }
            }
        }
        PopScaleformMovieFunctionVoid();
    }

    async loadStreamedTextureDict(name: string): Promise<void> {
        if (!HasStreamedTextureDictLoaded(name)) {
            RequestStreamedTextureDict(name, true);

            while (!HasStreamedTextureDictLoaded(name)) {
                await wait(0);
            }
        }
    }

    async loadWeaponAsset(name: number): Promise<void> {
        if (!HasWeaponAssetLoaded(name)) {
            RequestWeaponAsset(name, 31, 0);

            while (!HasWeaponAssetLoaded(name)) {
                await wait(0);
            }
        }
    }

    unloadWeaponAsset(name: number): void {
        RemoveWeaponAsset(name);
    }

    async loadClipSet(name: string): Promise<void> {
        if (!HasClipSetLoaded(name)) {
            RequestClipSet(name);

            while (!HasClipSetLoaded(name)) {
                await wait(0);
            }
        }
    }
}

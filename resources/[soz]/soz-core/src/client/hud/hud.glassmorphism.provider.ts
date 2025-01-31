import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class HudGlassmorphismProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private _fpsLimit = GetResourceKvpInt('soz_hud_fps_limit') || 30;
    private _disableGlassmorphism = GetResourceKvpInt('soz_hud_glassmorphism_disabled') === 1;

    public get glassmorphism(): boolean {
        return !this._disableGlassmorphism;
    }

    public set glassmorphism(enabled: boolean) {
        this._disableGlassmorphism = !enabled;
        SetResourceKvpInt('soz_hud_glassmorphism_disabled', enabled ? 0 : 1);
        this.nuiDispatch.dispatch('hud', 'SetGlassmorphism', this.glassmorphism);
    }

    public get glassmorphismFpsLimit(): number {
        return this._fpsLimit;
    }

    public set glassmorphismFpsLimit(limit: number) {
        this._fpsLimit = limit;
        SetResourceKvpInt('soz_hud_fps_limit', limit);
        this.nuiDispatch.dispatch('hud', 'SetGlassmorphismFps', this.glassmorphismFpsLimit);
    }

    @Once(OnceStep.NuiLoaded)
    public async onNuiLoaded(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'SetGlassmorphism', this.glassmorphism);
        this.nuiDispatch.dispatch('hud', 'SetGlassmorphismFps', this.glassmorphismFpsLimit);
    }
}

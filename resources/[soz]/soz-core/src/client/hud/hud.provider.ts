import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { HudComponent } from '../../shared/hud';

@Provider()
export class HudProvider {
    public isHudVisible = true;

    public isCinematicMode = false;

    public isCinematicCameraActive = false;

    @Tick()
    public async tick(): Promise<void> {
        if (!this.isHudVisible) {
            HideHelpTextThisFrame();
            HideHudAndRadarThisFrame();
            HideHudComponentThisFrame(HudComponent.SubtitleText);
            HideHudComponentThisFrame(HudComponent.GameStream);
        }

        if (this.isCinematicCameraActive) {
            ForceCinematicRenderingThisUpdate(true);
        }

        if (this.isCinematicMode) {
            DrawRect(0.5, 0.05, 1.0, 0.1, 0, 0, 0, 255);
            DrawRect(0.5, 0.95, 1.0, 0.1, 0, 0, 0, 255);
        }
    }
}

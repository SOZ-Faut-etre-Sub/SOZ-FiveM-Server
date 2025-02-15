import { On, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event';
import { HudComponent } from '../../shared/hud';
import { NuiDispatch } from '../nui/nui.dispatch';
import { HudMinimapProvider } from './hud.minimap.provider';

const ALLOWED_RETICLE_WEAPONS = new Set([
    GetHashKey('WEAPON_RPG'),
    GetHashKey('WEAPON_SNIPERRIFLE'),
    GetHashKey('WEAPON_HEAVYSNIPER'),
    GetHashKey('WEAPON_HEAVYSNIPER_MK2'),
    GetHashKey('WEAPON_MARKSMANRIFLE'),
    GetHashKey('WEAPON_MARKSMANRIFLE_MK2'),
]);

@Provider()
export class HudStateProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(HudMinimapProvider)
    private readonly hudMinimapProvider: HudMinimapProvider;

    private isHudVisible = true;

    private isCinematicMode = false;
    private cinematicModeTransitionEnd = 0;
    private cinematicModeTransitionStart = 0;

    private isPhoneCameraMode = false;

    private isCinematicCameraActive = false;

    private isCrosshairVisible = false;

    private _isComputedHudVisible = true;

    public get isComputedHudVisible(): boolean {
        return this._isComputedHudVisible;
    }

    public getState() {
        return {
            isHudVisible: this.isHudVisible,
            isCinematicMode: this.isCinematicMode,
            isPhoneCameraMode: this.isPhoneCameraMode,
            isCinematicCameraActive: this.isCinematicCameraActive,
        };
    }

    public setHudVisible(visible: boolean): void {
        this.isHudVisible = visible;
        this.updateHudState();
    }

    public setCinematicMode(enabled: boolean, transitionTime = 0): void {
        this.isCinematicMode = enabled;
        this.cinematicModeTransitionStart = Date.now();
        this.cinematicModeTransitionEnd = this.cinematicModeTransitionStart + transitionTime;
        this.updateHudState();
    }

    public setCinematicCameraActive(enabled: boolean): void {
        DisableVehiclePassengerIdleCamera(!enabled);
        this.isCinematicCameraActive = enabled;
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE_CROSSHAIR)
    public setCrosshairVisible(visible: boolean): void {
        this.isCrosshairVisible = visible;
    }

    private updateHudState(): void {
        this._isComputedHudVisible = this.isHudVisible && !this.isCinematicMode && !this.isPhoneCameraMode;

        this.hudMinimapProvider.showHud = this._isComputedHudVisible;
        this.nuiDispatch.dispatch('global', 'HideHud', !this._isComputedHudVisible);
    }

    @Tick()
    public async disableHudLoop(): Promise<void> {
        // Basic components hide
        HideHudComponentThisFrame(HudComponent.WantedStars);
        HideHudComponentThisFrame(HudComponent.WeaponIcon);
        HideHudComponentThisFrame(HudComponent.Cash);
        HideHudComponentThisFrame(HudComponent.MpCash);
        HideHudComponentThisFrame(HudComponent.AreaName);
        HideHudComponentThisFrame(HudComponent.VehicleClass);
        HideHudComponentThisFrame(HudComponent.StreetName);
        HideHudComponentThisFrame(HudComponent.CashChange);
        HideHudComponentThisFrame(HudComponent.SavingGame);
        HideHudComponentThisFrame(HudComponent.WeaponWheel);
        HideHudComponentThisFrame(HudComponent.WeaponWheelStats);
        HideHudComponentThisFrame(HudComponent.HudComponents);
        HideHudComponentThisFrame(HudComponent.HudWeapons);

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
            const transaitionDuration = this.cinematicModeTransitionEnd - this.cinematicModeTransitionStart;
            let h = 1.0;
            if (transaitionDuration) {
                h = (Date.now() - this.cinematicModeTransitionStart) / transaitionDuration;
                if (h > 1.0) {
                    this.cinematicModeTransitionStart = 0;
                    this.cinematicModeTransitionEnd = 0;
                    h = 1.0;
                }
            }

            DrawRect(0.5, h / 20, 1.0, h / 10, 0, 0, 0, 255);
            DrawRect(0.5, 1 - h / 20, 1.0, h / 10, 0, 0, 0, 255);
        }

        // handle reticle
        const ped = PlayerPedId();
        const [, weapon] = GetCurrentPedWeapon(ped, true);

        if (!this.isCrosshairVisible && !ALLOWED_RETICLE_WEAPONS.has(weapon)) {
            HideHudComponentThisFrame(HudComponent.Reticle);
        }
    }

    @On(ClientEvent.PHONE_CAMERA_OPEN)
    public enterCamera(): void {
        this.isPhoneCameraMode = true;
        this.updateHudState();
    }

    @On(ClientEvent.PHONE_CAMERA_CLOSE)
    public exitCamera(): void {
        this.isPhoneCameraMode = false;
        this.updateHudState();
    }
}

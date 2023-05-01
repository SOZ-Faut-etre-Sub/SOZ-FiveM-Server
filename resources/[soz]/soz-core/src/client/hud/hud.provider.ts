import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { HudComponent, Minimap } from '../../shared/hud';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ResourceLoader } from '../resources/resource.loader';

const ALLOWED_RETICLE_WEAPONS = new Set([
    GetHashKey('WEAPON_RPG'),
    GetHashKey('WEAPON_SNIPERRIFLE'),
    GetHashKey('WEAPON_HEAVYSNIPER'),
    GetHashKey('WEAPON_HEAVYSNIPER_MK2'),
    GetHashKey('WEAPON_MARKSMANRIFLE'),
    GetHashKey('WEAPON_MARKSMANRIFLE_MK2'),
]);

@Provider()
export class HudProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private minimapHandle: number;

    public isHudVisible = true;

    public isCinematicMode = false;

    public isCinematicCameraActive = false;

    @Tick()
    public async disableHudLoop(): Promise<void> {
        // Basic components hide
        HideHudComponentThisFrame(HudComponent.WantedStars);
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
            DrawRect(0.5, 0.05, 1.0, 0.1, 0, 0, 0, 255);
            DrawRect(0.5, 0.95, 1.0, 0.1, 0, 0, 0, 255);
        }

        // handle reticle
        const ped = PlayerPedId();
        const [, weapon] = GetCurrentPedWeapon(ped, true);

        if (!ALLOWED_RETICLE_WEAPONS.has(weapon)) {
            HideHudComponentThisFrame(HudComponent.Reticle);
        }

        if (this.minimapHandle) {
            BeginScaleformMovieMethod(this.minimapHandle, 'SETUP_HEALTH_ARMOUR');
            ScaleformMovieMethodAddParamInt(3);
            EndScaleformMovieMethod();
        }
    }

    @Once(OnceStep.Start)
    public async start(): Promise<void> {
        AddTextEntry('PM_PANE_CFX', 'SO~g~Z~w~~italic~ ~s~(FiveM)');
        AddTextEntry('FE_THDR_GTAO', 'SO~g~Z~w~~italic~ - Serveur GTA RP Communautaire');
        AddTextEntry('PM_SCR_MAP', "CARTE DE L'ÎLE");
        AddTextEntry('PM_SCR_GAM', 'ACTIONS FIVEM');
        AddTextEntry('PM_PANE_LEAVE', 'Retourner au menu');
        AddTextEntry('PM_PANE_QUIT', 'Retourner au bureau');
        AddTextEntry('PM_SCR_SET', 'PARAMÈTRES');

        await this.resourceLoader.loadStreamedTextureDict('soz_minimap');

        AddReplaceTexture('platform:/textures/graphics', 'radarmasksm', 'soz_minimap', 'radarmasksm');
        AddReplaceTexture('minimap', 'blips_texturesheet_ng', 'soz_minimap', 'blips_texturesheet_ng');
        AddReplaceTexture('minimap', 'blips_texturesheet_ng_2', 'soz_minimap', 'blips_texturesheet_ng_2');

        this.minimapHandle = RequestScaleformMovie('minimap');
        SetRadarBigmapEnabled(false, false);
    }

    @Once(OnceStep.NuiLoaded)
    public async nuiLoaded(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());
    }

    private getMinimap(): Minimap {
        const [x, y] = GetActiveScreenResolution();
        const aspectRatio = GetAspectRatio(false);
        const scaleX = 1.0 / x;
        const scaleY = 1.0 / y;

        SetScriptGfxAlign('L'.charCodeAt(0), 'B'.charCodeAt(0));
        const [rawX, rawY] = GetScriptGfxPosition(-0.0045, 0.002 + -0.188888);
        ResetScriptGfxAlign();

        const width = scaleX * (x / (4 * aspectRatio));
        const height = scaleY * (y / 5.674);

        return {
            width,
            height,
            left: rawX,
            right: rawX + width,
            top: rawY,
            bottom: rawY + height,
            X: rawX + width / 2,
            Y: rawY + height / 2,
        };
    }
}

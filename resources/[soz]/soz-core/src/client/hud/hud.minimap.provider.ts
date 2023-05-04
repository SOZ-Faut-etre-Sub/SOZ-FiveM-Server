import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event';
import { Minimap } from '../../shared/hud';
import { InventoryManager } from '../inventory/inventory.manager';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ResourceLoader } from '../resources/resource.loader';

@Provider()
export class HudMinimapProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    private minimapHandle: number;

    private _haveGps = false;

    private _hasAdminGps = false;

    private _showHud = true;

    private _inVehicle = false;

    public get hasAdminGps(): boolean {
        return this._hasAdminGps;
    }

    public set hasAdminGps(value: boolean) {
        this._hasAdminGps = value;
        this.updateShowRadar();
    }

    public set showHud(value: boolean) {
        this._showHud = value;
        this.updateShowRadar();
    }

    @Once(OnceStep.PlayerLoaded)
    public async onStartCheckShowRadar(): Promise<void> {
        this.updateShowRadar();
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    public onBaseEnteredVehicle(): void {
        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (vehicle && !IsThisModelABicycle(GetEntityModel(vehicle))) {
            this._inVehicle = true;
        }

        this.updateShowRadar();
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public onBaseLeftVehicle(): void {
        this._inVehicle = false;
        this.updateShowRadar();
    }

    @Once(OnceStep.NuiLoaded)
    public async nuiLoaded(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(): Promise<void> {
        this._haveGps = this.inventoryManager.hasEnoughItem('gps', 1, true);
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

    @Tick()
    public async enableMinimapHealthArmour(): Promise<void> {
        if (this.minimapHandle) {
            BeginScaleformMovieMethod(this.minimapHandle, 'SETUP_HEALTH_ARMOUR');
            ScaleformMovieMethodAddParamInt(3);
            EndScaleformMovieMethod();
        }
    }

    private updateShowRadar(): void {
        const showRadar = this._showHud && ((this._inVehicle && this._haveGps) || this._hasAdminGps);

        DisplayRadar(showRadar);
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

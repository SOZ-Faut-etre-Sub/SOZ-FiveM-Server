import { PlayerUpdate } from '@public/core/decorators/player';
import { PlayerData } from '@public/shared/player';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { Minimap } from '../../shared/hud';
import { VehicleSeat } from '../../shared/vehicle/vehicle';
import { InventoryManager } from '../inventory/inventory.manager';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ResourceLoader } from '../repository/resource.loader';
import { HudWatchProvider } from './hud.watch.provider';

@Provider()
export class HudMinimapProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject(HudWatchProvider)
    private readonly hudWatchProvider: HudWatchProvider;

    private minimapHandle: number;

    private _haveGps = false;
    private _hasAdminGps = false;
    private _dead = false;
    private _showHud = true;

    private _inVehicle = GetVehiclePedIsIn(PlayerPedId(), false) !== 0;
    private _scaledNui = GetResourceKvpInt('soz_scaled_nui') === 1;

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

    public get scaledNui(): boolean {
        return this._scaledNui;
    }

    public set scaledNui(value: boolean) {
        this._scaledNui = value;
        SetResourceKvpInt('soz_scaled_nui', value ? 1 : 0);
        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());
    }

    @Once(OnceStep.PlayerLoaded, true)
    public async onStartCheckShowRadar(): Promise<void> {
        this.updateShowRadar();
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    @OnEvent(ClientEvent.BASE_CHANGE_VEHICLE_SEAT)
    public async onBaseEnteredVehicle(vehicle: number, seat: VehicleSeat): Promise<void> {
        this._inVehicle = vehicle && (VehicleSeat.Driver === seat || VehicleSeat.Copilot === seat);

        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap(true));
        await wait(200);
        this.updateShowRadar();
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public onBaseLeftVehicle(): void {
        this._inVehicle = false;

        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());
        this.updateShowRadar();
    }

    @PlayerUpdate()
    async onPlayerUpdate(player: PlayerData): Promise<void> {
        this._haveGps =
            this.inventoryManager.hasEnoughItem('gps', 1, true) ||
            this.inventoryManager.hasEnoughItem('halloween_atomic_gps', 1, true);
        this._dead = player?.metadata.isdead;
    }

    @Once(OnceStep.NuiLoaded)
    public async start(): Promise<void> {
        ForceCloseTextInputBox();
        SetRadarBigmapEnabled(false, false);
        DisplayRadar(false);

        AddTextEntry('PM_PANE_CFX', 'SO~g~Z~w~~italic~ ~s~(FiveM)');
        AddTextEntry('FE_THDR_GTAO', 'SO~g~Z~w~~italic~ - Serveur GTA RP Communautaire');
        AddTextEntry('PM_SCR_MAP', "CARTE DE L'ÎLE");
        AddTextEntry('PM_SCR_GAM', 'ACTIONS FIVEM');
        AddTextEntry('PM_PANE_LEAVE', 'Retourner au menu');
        AddTextEntry('PM_PANE_QUIT', 'Retourner au bureau');
        AddTextEntry('PM_SCR_SET', 'PARAMÈTRES');

        await this.resourceLoader.loadStreamedTextureDict('soz_minimap');
        this.minimapHandle = await this.resourceLoader.loadScaleformMovie('minimap');

        AddReplaceTexture('platform:/textures/graphics', 'radarmasksm', 'soz_minimap', 'radarmasksm');
        AddReplaceTexture('minimap', 'blips_texturesheet_ng', 'soz_minimap', 'blips_texturesheet_ng');
        AddReplaceTexture('minimap', 'blips_texturesheet_ng_2', 'soz_minimap', 'blips_texturesheet_ng_2');

        await this.updateMinimapPosition();
        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());

        const northBlip = GetNorthRadarBlip();
        SetBlipAlpha(northBlip, 0);
    }

    @Tick()
    public async enableMinimapHealthArmour(): Promise<void> {
        if (!this.minimapHandle) return;

        BeginScaleformMovieMethod(this.minimapHandle, 'SETUP_HEALTH_ARMOUR');
        ScaleformMovieMethodAddParamInt(3);
        EndScaleformMovieMethod();
    }

    private updateShowRadar(): void {
        const showRadar = this._showHud && ((this._inVehicle && this._haveGps && !this._dead) || this._hasAdminGps);

        DisplayRadar(showRadar);
        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async updateHud(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'UpdateDateTime', {
            hour: GetClockHours(),
            minute: GetClockMinutes(),
            dayOfWeek: GetClockDayOfWeek(),
        });
    }

    protected getMinimapOffset(): number {
        const haveWatch = this.hudWatchProvider.haveWatch;
        const showStreetName = this.hudWatchProvider.showStreetName;

        return haveWatch && showStreetName ? -0.05 : 0.0;
    }

    @OnEvent(ClientEvent.UPDATE_MINIMAP_POSITION)
    public async updateMinimapPosition(): Promise<void> {
        const offset = this.getMinimapOffset();

        this.minimapHandle = await this.resourceLoader.loadScaleformMovie('minimap');

        SetMinimapComponentPosition('minimap', 'L', 'B', -0.0045, 0.002 + offset, 0.15, 0.188888);
        SetMinimapComponentPosition('minimap_mask', 'L', 'B', 0.02, 0.032 + offset, 0.111, 0.159);
        SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.03, 0.022 + offset, 0.266, 0.237);

        await this.reloadMinimapSize();

        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());
    }

    protected async reloadMinimapSize() {
        SetRadarBigmapEnabled(true, false);
        while (IsBigmapActive()) {
            await wait(10);
            SetRadarBigmapEnabled(false, false);
        }
        return true;
    }

    private getMinimap(skipRadarCompute = false): Minimap {
        const [x, y] = GetActiveScreenResolution();
        const aspectRatio = GetAspectRatio(false);
        const scaleX = 1.0 / x;
        const scaleY = 1.0 / y;
        const isRadarHidden = IsRadarHidden();

        let rawX;
        let rawY;
        let width;
        let height;

        SetScriptGfxAlign('L'.charCodeAt(0), 'B'.charCodeAt(0));
        if (IsBigmapActive()) {
            [rawX, rawY] = GetScriptGfxPosition(-0.003975, 0.022 - 0.460416666);
            width = scaleX * (x / (2.52 * aspectRatio));
            height = scaleY * (y / 2.3374);
        } else {
            const offset = this.getMinimapOffset();

            [rawX, rawY] = GetScriptGfxPosition(-0.0045, 0.002 + offset + -0.19);
            width = scaleX * (x / (4 * aspectRatio));
            height = scaleY * (y / 5.674);
        }

        ResetScriptGfxAlign();

        if (this.scaledNui) {
            width = 0.1406249989522621;
            height = 0.17624250969333802;
            rawY = 0.796259343624115 + this.getMinimapOffset();
            rawX = 0.01060426700860262;
        }

        if (!skipRadarCompute && isRadarHidden) {
            rawY += height;
            height = 0;
        }

        return {
            width,
            height,
            left: rawX,
            right: rawX + width,
            top: rawY,
            bottom: rawY + height,
            X: rawX + width / 2,
            Y: rawY + height / 2,
            isHidden: isRadarHidden,
        };
    }
}

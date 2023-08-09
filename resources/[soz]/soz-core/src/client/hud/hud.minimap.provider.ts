import { PlayerData } from '@public/shared/player';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event';
import { Minimap } from '../../shared/hud';
import { VehicleSeat } from '../../shared/vehicle/vehicle';
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
    public onBaseEnteredVehicle(vehicle: number, seat: VehicleSeat): void {
        this._inVehicle = vehicle && (VehicleSeat.Driver === seat || VehicleSeat.Copilot === seat);

        this.updateShowRadar();
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    public onBaseLeftVehicle(): void {
        this._inVehicle = false;
        this.updateShowRadar();
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(player: PlayerData): Promise<void> {
        this._haveGps = this.inventoryManager.hasEnoughItem('gps', 1, true);
        this._dead = player?.metadata.isdead;
    }

    @Once(OnceStep.NuiLoaded)
    public async start(): Promise<void> {
        ForceCloseTextInputBox();
        DisplayRadar(false);

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

        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());
        this.minimapHandle = await this.resourceLoader.loadScaleformMovie('minimap');

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
        const showRadar = this._showHud && ((this._inVehicle && this._haveGps && !this._dead) || this._hasAdminGps);

        DisplayRadar(showRadar);
    }

    @Tick(1000)
    public async updateMinimap(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'UpdateMinimap', this.getMinimap());
    }

    private getMinimap(): Minimap {
        const [x, y] = GetActiveScreenResolution();
        const aspectRatio = GetAspectRatio(false);
        const scaleX = 1.0 / x;
        const scaleY = 1.0 / y;

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
            [rawX, rawY] = GetScriptGfxPosition(-0.0045, 0.002 + -0.188888);
            width = scaleX * (x / (4 * aspectRatio));
            height = scaleY * (y / 5.674);
        }

        ResetScriptGfxAlign();

        if (this.scaledNui) {
            return {
                X: 0.08091666683321,
                Y: 0.88549252311906,
                bottom: 0.97361377796573,
                height: 0.17624250969333,
                left: 0.01560416735708,
                right: 0.15122916630934,
                top: 0.79737126827239,
                width: 0.14062499895226,
            };
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
        };
    }
}

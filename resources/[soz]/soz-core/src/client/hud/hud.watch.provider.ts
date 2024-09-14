import { PlayerUpdate } from '@public/core/decorators/player';

import { Command } from '../../core/decorators/command';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { HudSettings, HudTheme } from '../../shared/hud';
import { MenuType } from '../../shared/nui/menu';
import { InventoryManager } from '../inventory/inventory.manager';
import { AudioService } from '../nui/audio.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class HudWatchProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Inject(AudioService)
    private readonly audioService: AudioService;

    @Inject(NuiMenu)
    private readonly menu: NuiMenu;

    private _watchForceEnabled = false;
    private _watchDisabled = false;
    private _haveWatch = false;

    private _theme = (GetResourceKvpString('soz_hud_theme') as HudTheme) ?? HudTheme.Auto;
    private _zoom = 1; //GetResourceKvpFloat('soz_hud_zoom') ?? 1;
    private _hideDateTime = GetResourceKvpInt('soz_hud_datetime_hide') === 1;
    private _hideWeather = GetResourceKvpInt('soz_hud_weather_hide') === 1;
    private _hideStreetName = GetResourceKvpInt('soz_hud_street_name_hide') === 1;
    private _hideCompass = GetResourceKvpInt('soz_hud_compass_hide') === 1;
    private _hideStress = GetResourceKvpInt('soz_hud_stress_hide') === 1;
    private _hideStamina = GetResourceKvpInt('soz_hud_stamina_hide') === 1;

    public get haveWatch(): boolean {
        if (this._watchForceEnabled) return true;
        if (this._watchDisabled) return false;
        return this._haveWatch;
    }

    @PlayerUpdate()
    async onPlayerUpdate(): Promise<void> {
        this._haveWatch = this.inventoryManager.hasEnoughItem('smartwatchuiwi', 1, true);
        this.nuiDispatch.dispatch('hud', 'UpdateHasWatch', this.haveWatch);
    }

    public disableWatch(value: boolean): void {
        this._watchDisabled = value;
        this.nuiDispatch.dispatch('hud', 'UpdateHasWatch', this.haveWatch);
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'UpdateHasWatch', this.haveWatch);
    }

    @Once(OnceStep.NuiLoaded)
    public async onNuiLoaded(): Promise<void> {
        this.nuiDispatch.dispatch('hud', 'UpdateSettings', this.getSettings());
    }

    @OnEvent(ClientEvent.ITEM_WATCH_USE)
    public onWatchUse(): void {
        if (this.menu.getOpened() === MenuType.WatchMenu) {
            this.menu.closeMenu();
            return;
        }

        this.menu.openMenu(MenuType.WatchMenu, this.getSettings());
    }

    @Command('soz_core_quick_show_watch', {
        description: 'Affiche la montre connectée',
        passthroughNuiFocus: true,
        keys: [
            {
                mapper: 'keyboard',
                key: 'GRAVE',
            },
        ],
    })
    public async quickShowWatch() {
        this._watchForceEnabled = true;
        this.nuiDispatch.dispatch('hud', 'UpdateSettings', {
            theme: this._theme,
            zoom: this._zoom,
            showDateTime: true,
            showWeather: true,
            showStreetName: true,
            showCompass: true,
            showStress: true,
            showStamina: true,
        });
        this.audioService.playAudio('audio/uwu.mp3', 0.1);

        await wait(5 * 1000);

        this.nuiDispatch.dispatch('hud', 'UpdateSettings', this.getSettings());
        this._watchForceEnabled = false;
    }

    @OnNuiEvent(NuiEvent.WatchMenuSetTheme)
    public async setTheme(value: HudTheme) {
        this.theme = value;
    }

    @OnNuiEvent(NuiEvent.WatchMenuSetZoom)
    public async setZoom(value: number) {
        this.zoom = value;
    }

    @OnNuiEvent(NuiEvent.WatchMenuSetShowDateTime)
    public async setDateTime(value: boolean) {
        this.dateTime = value;
    }

    @OnNuiEvent(NuiEvent.WatchMenuSetShowWeather)
    public async setWeather(value: boolean) {
        this.weather = value;
    }

    @OnNuiEvent(NuiEvent.WatchMenuSetShowStreetName)
    public async setStreetName(value: boolean) {
        this.streetName = value;
    }

    @OnNuiEvent(NuiEvent.WatchMenuSetShowCompass)
    public async setCompass(value: boolean) {
        this.compass = value;
    }

    @OnNuiEvent(NuiEvent.WatchMenuSetShowStress)
    public async setStress(value: boolean) {
        this.stress = value;
    }

    @OnNuiEvent(NuiEvent.WatchMenuSetShowStamina)
    public async setStamina(value: boolean) {
        this.stamina = value;
    }

    public getSettings(): HudSettings {
        return {
            theme: this._theme,
            zoom: this._zoom,
            showDateTime: !this._hideDateTime,
            showWeather: !this._hideWeather,
            showStreetName: !this._hideStreetName,
            showCompass: !this._hideCompass,
            showStress: !this._hideStress,
            showStamina: !this._hideStamina,
        };
    }

    public set theme(value: HudTheme) {
        this._theme = value;
        SetResourceKvp('soz_hud_theme', value);
        this.nuiDispatch.dispatch('hud', 'SetTheme', this._theme);
    }

    public set zoom(value: number) {
        this._zoom = value;
        SetResourceKvpFloat('soz_hud_zoom', value);
        this.nuiDispatch.dispatch('hud', 'SetZoom', this._zoom);
    }

    public set dateTime(value: boolean) {
        this._hideDateTime = !value;
        SetResourceKvpInt('soz_hud_datetime_hide', this._hideDateTime ? 1 : 0);
        this.nuiDispatch.dispatch('hud', 'SetShowDateTime', value);
    }

    public set weather(value: boolean) {
        this._hideWeather = !value;
        SetResourceKvpInt('soz_hud_weather_hide', this._hideWeather ? 1 : 0);
        this.nuiDispatch.dispatch('hud', 'SetShowWeather', value);
    }

    public set streetName(value: boolean) {
        this._hideStreetName = !value;
        SetResourceKvpInt('soz_hud_street_name_hide', this._hideStreetName ? 1 : 0);
        this.nuiDispatch.dispatch('hud', 'SetShowStreetName', value);
    }

    public get showCompass() {
        if (this._watchForceEnabled) return true;
        return !this._hideCompass;
    }

    public set compass(value: boolean) {
        this._hideCompass = !value;
        SetResourceKvpInt('soz_hud_compass_hide', this._hideCompass ? 1 : 0);
        this.nuiDispatch.dispatch('hud', 'SetShowCompass', value);
    }

    public set stress(value: boolean) {
        this._hideStress = !value;
        SetResourceKvpInt('soz_hud_stress_hide', this._hideStress ? 1 : 0);
        this.nuiDispatch.dispatch('hud', 'SetShowStress', value);
    }

    public set stamina(value: boolean) {
        this._hideStamina = !value;
        SetResourceKvpInt('soz_hud_stamina_hide', this._hideStamina ? 1 : 0);
        this.nuiDispatch.dispatch('hud', 'SetShowStamina', value);
    }
}

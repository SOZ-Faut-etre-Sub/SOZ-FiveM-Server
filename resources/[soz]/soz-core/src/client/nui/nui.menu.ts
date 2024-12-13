import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event';
import { MenuType, MenuTypeMap } from '../../shared/nui/menu';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { NuiDispatch } from './nui.dispatch';

type MenuPosition = {
    position: Vector3 | Vector4 | (() => Vector3 | Vector4);
    distance: number;
};

type OpenMenuConfig = {
    useMouse?: boolean;
    subMenuId?: string;
    position?: MenuPosition;
    originMenuType?: MenuType;
};

@Provider()
export class NuiMenu {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    private menuPosition: MenuPosition | null = null;

    public openMenu<K extends keyof MenuTypeMap>(menuType: K, data?: MenuTypeMap[K], config?: OpenMenuConfig) {
        this.dispatcher.setMenuOpen(menuType);
        this.dispatcher.dispatch('inventory', 'SetOpen', false);
        this.dispatcher.dispatch('inventory', 'UpdateInventory', { configuration: null, items: [], id: null });

        exports['menuv'].SendNUIMessage({ action: 'KEY_CLOSE_ALL' });

        this.menuPosition = config?.position || null;
        this.dispatcher.dispatch('menu', 'SetMenuType', {
            menuType,
            data,
            useMouse: config?.useMouse || false,
            subMenuId: config?.subMenuId,
            originMenuType: config?.originMenuType,
        });
    }

    public setMenuVisibility(value: boolean) {
        this.dispatcher.dispatch('menu', 'SetMenuVisibility', value);
    }

    @Tick(TickInterval.EVERY_SECOND)
    public closeMenuIfTooFar() {
        if (!this.menuPosition || this.getOpened() === null) {
            return;
        }

        const playerPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
        let position = this.menuPosition.position;

        if (typeof position === 'function') {
            position = position();
        }

        const distance = getDistance(playerPosition, position);

        if (distance > this.menuPosition.distance) {
            this.closeMenu(false);
        }
    }

    public closeAll(skipCloseEvent = false) {
        exports['menuv'].SendNUIMessage({ action: 'KEY_CLOSE_ALL' });
        this.dispatcher.dispatch('bank', 'CloseInterface');
        this.closeMenu(skipCloseEvent);
    }

    @OnEvent(ClientEvent.CORE_CLOSE_MENU)
    public closeMenu(skipCloseEvent = false) {
        if (this.getOpened() === null) {
            return;
        }

        this.menuPosition = null;
        this.dispatcher.setMenuOpen(null);
        this.dispatcher.dispatch('menu', 'CloseMenu', skipCloseEvent);
    }

    getOpened(): MenuType | null {
        return this.dispatcher.getMenuOpened();
    }

    goBack() {
        this.dispatcher.dispatch('menu', 'Backspace');
    }
}

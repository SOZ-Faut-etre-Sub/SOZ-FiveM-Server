import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { ClientEvent } from '../../shared/event';
import { MenuType, MenuTypeMap } from '../../shared/nui/menu';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { NuiDispatch } from './nui.dispatch';

type MenuPosition = {
    position: Vector3 | Vector4;
    distance: number;
};

type OpenMenuConfig = {
    useMouse?: boolean;
    subMenuId?: string;
    position?: MenuPosition;
};

@Provider()
export class NuiMenu {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    private menuPosition: MenuPosition | null = null;

    public openMenu<K extends keyof MenuTypeMap>(menuType: K, data?: MenuTypeMap[K], config?: OpenMenuConfig) {
        this.dispatcher.setMenuOpen(menuType);
        exports['menuv'].SendNUIMessage({ action: 'KEY_CLOSE_ALL' });

        this.menuPosition = config?.position || null;
        this.dispatcher.dispatch('menu', 'SetMenuType', {
            menuType,
            data,
            useMouse: config?.useMouse || false,
            subMenuId: config?.subMenuId,
        });
    }

    @Tick(TickInterval.EVERY_SECOND)
    public closeMenuIfTooFar() {
        if (!this.menuPosition || this.getOpened() === null) {
            return;
        }

        const playerPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const distance = getDistance(playerPosition, this.menuPosition.position);

        if (distance > this.menuPosition.distance) {
            this.closeMenu(false);
        }
    }

    public closeAll(skipCloseEvent = true) {
        exports['menuv'].SendNUIMessage({ action: 'KEY_CLOSE_ALL' });
        this.closeMenu(skipCloseEvent);
    }

    @OnEvent(ClientEvent.CORE_CLOSE_MENU)
    public closeMenu(skipCloseEvent = true) {
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
}

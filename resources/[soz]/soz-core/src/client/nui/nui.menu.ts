import { OnEvent } from '../../core/decorators/event';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { ClientEvent } from '../../shared/event';
import { MenuType, MenuTypeMap } from '../../shared/nui/menu';
import { NuiDispatch } from './nui.dispatch';

@Injectable()
export class NuiMenu {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    public openMenu<K extends keyof MenuTypeMap>(menuType: K, data?: MenuTypeMap[K], subMenuId?: string) {
        this.dispatcher.setMenuOpen(menuType);
        exports['menuv'].SendNUIMessage({ action: 'KEY_CLOSE_ALL' });

        this.dispatcher.dispatch('menu', 'SetMenuType', { menuType, data, subMenuId });
    }

    @OnEvent(ClientEvent.CORE_CLOSE_MENU)
    public closeMenu() {
        this.dispatcher.setMenuOpen(null);
        this.dispatcher.dispatch('menu', 'CloseMenu');
    }

    getOpened(): MenuType | null {
        return this.dispatcher.getMenuOpened();
    }
}

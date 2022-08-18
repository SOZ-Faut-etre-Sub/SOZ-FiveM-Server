import { OnEvent } from '../../core/decorators/event';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { ClientEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { NuiDispatch } from './nui.dispatch';

@Injectable()
export class NuiMenu {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    public openMenu(menuType: MenuType) {
        exports['menuv'].SendNUIMessage({ action: 'KEY_CLOSE_ALL' });

        this.dispatcher.dispatch('menu', 'SetMenuType', menuType);
    }

    @OnEvent(ClientEvent.CORE_CLOSE_MENU)
    public closeMenu() {
        this.dispatcher.dispatch('menu', 'CloseMenu');
    }
}

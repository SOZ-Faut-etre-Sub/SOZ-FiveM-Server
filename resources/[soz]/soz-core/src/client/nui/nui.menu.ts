import { OnEvent } from '../../core/decorators/event';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { ClientEvent } from '../../shared/event';
import { MenuTypeMap } from '../../shared/nui/menu';
import { NuiDispatch } from './nui.dispatch';

@Injectable()
export class NuiMenu {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    private isMenuOpen = false;

    public openMenu<K extends keyof MenuTypeMap>(menuType: K, data?: MenuTypeMap[K]) {
        console.log('open menu');
        this.isMenuOpen = true;
        exports['menuv'].SendNUIMessage({ action: 'KEY_CLOSE_ALL' });

        this.dispatcher.dispatch('menu', 'SetMenuType', { menuType, data });
    }

    @OnEvent(ClientEvent.CORE_CLOSE_MENU)
    public closeMenu() {
        console.log('close menu');
        this.isMenuOpen = false;
        this.dispatcher.dispatch('menu', 'CloseMenu');
    }

    public isOpen() {
        return this.isMenuOpen;
    }
}

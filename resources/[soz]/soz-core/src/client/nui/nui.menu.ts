import { Inject, Injectable } from '../../core/decorators/injectable';
import { MenuType } from '../../shared/nui/menu';
import { NuiDispatch } from './nui.dispatch';

@Injectable()
export class NuiMenu {
    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    public openMenu(menuType: MenuType) {
        this.dispatcher.dispatch('menu', 'SetMenuType', menuType);
    }
}

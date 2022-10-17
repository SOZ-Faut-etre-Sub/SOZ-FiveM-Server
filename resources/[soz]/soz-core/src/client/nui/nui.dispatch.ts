import { Injectable } from '../../core/decorators/injectable';
import { NuiMethodMap } from '../../shared/nui';
import { MenuType } from '../../shared/nui/menu';

@Injectable()
export class NuiDispatch {
    public menuOpened: MenuType | null = null;

    dispatch<App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
        app: App,
        method: Method,
        data?: NuiMethodMap[App][Method]
    ) {
        SendNuiMessage(JSON.stringify({ app, method, data }));
    }

    setMenuOpen(menu: MenuType | null) {
        this.menuOpened = menu;
    }

    getMenuOpened(): MenuType | null {
        return this.menuOpened;
    }
}

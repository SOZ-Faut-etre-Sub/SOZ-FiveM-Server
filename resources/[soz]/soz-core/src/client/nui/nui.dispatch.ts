import { Injectable } from '../../core/decorators/injectable';
import { NuiMethodMap } from '../../shared/nui';

@Injectable()
export class NuiDispatch {
    public isMenuOpen = false;

    dispatch<App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
        app: App,
        method: Method,
        data?: NuiMethodMap[App][Method]
    ) {
        SendNuiMessage(JSON.stringify({ app, method, data }));
    }

    setMenuOpen(isOpen: boolean) {
        this.isMenuOpen = isOpen;
    }

    isMenuOpened() {
        return this.isMenuOpen;
    }
}

import { Injectable } from '../../core/decorators/injectable';
import { NuiMethodMap } from '../../shared/nui';

@Injectable()
export class NuiDispatch {
    public isNuiFocused = false;
    public isNuiCursor = false;
    public isNuiKeepInput = false;
    public isMenuOpen = false;

    dispatch<App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
        app: App,
        method: Method,
        data?: NuiMethodMap[App][Method]
    ) {
        SendNuiMessage(JSON.stringify({ app, method, data }));
    }

    setNuiFocus(focus: boolean, cursor: boolean, keepGameInput = false) {
        SetNuiFocus(focus, cursor);
        SetNuiFocusKeepInput(keepGameInput);

        this.isNuiFocused = focus;
        this.isNuiCursor = cursor;
        this.isNuiKeepInput = keepGameInput;
    }

    setMenuOpen(isOpen: boolean) {
        this.isMenuOpen = isOpen;
    }

    isMenuOpened() {
        return this.isMenuOpen;
    }
}

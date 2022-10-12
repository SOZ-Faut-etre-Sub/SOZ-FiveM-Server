import { NuiAdminPlayerSubMenuMethodMap } from '../../nui/components/Admin/PlayerSubMenu';
import { NuiAdminSkinSubMenuMethodMap } from '../../nui/components/Admin/SkinSubMenu';
import { NuiClipboardMethodMap } from './clipboard';
import { NuiFfsRecipeBookMethodMap } from './ffs_recipe_book';
import { NuiHealthBookMethodMap } from './health_book';
import { NuiInputMethodMap } from './input';
import { NuiMenuMethodMap } from './menu';

export interface NuiGlobalMethodMap {
    PauseMenuActive: boolean;
}

export interface NuiMethodMap {
    global: NuiGlobalMethodMap;
    menu: NuiMenuMethodMap;
    input: NuiInputMethodMap;
    clipboard: NuiClipboardMethodMap;
    health_book: NuiHealthBookMethodMap;
    ffs_recipe_book: NuiFfsRecipeBookMethodMap;
    admin_skin_submenu: NuiAdminSkinSubMenuMethodMap;
    admin_player_submenu: NuiAdminPlayerSubMenuMethodMap;
}

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;

import { NuiAdminPlayerSubMenuMethodMap } from '../../nui/components/Admin/PlayerSubMenu';
import { NuiAdminSkinSubMenuMethodMap } from '../../nui/components/Admin/SkinSubMenu';
import { NuiBennysOrderMenuMethodMap } from './bennys_order_menu';
import { NuiClipboardMethodMap } from './clipboard';
import { NuiFfsRecipeBookMethodMap } from './ffs_recipe_book';
import { NuiHealthBookMethodMap } from './health_book';
import { NuiInputMethodMap } from './input';
import { NuiMaskShopMethodMap } from './mask_shop';
import { NuiMenuMethodMap } from './menu';

export interface NuiGlobalMethodMap {
    PauseMenuActive: boolean;
}

export interface NuiMethodMap {
    global: NuiGlobalMethodMap;
    menu: NuiMenuMethodMap;
    input: NuiInputMethodMap;
    clipboard: NuiClipboardMethodMap;
    bennys_order_menu: NuiBennysOrderMenuMethodMap;
    health_book: NuiHealthBookMethodMap;
    ffs_recipe_book: NuiFfsRecipeBookMethodMap;
    mask_shop: NuiMaskShopMethodMap;
    admin_skin_submenu: NuiAdminSkinSubMenuMethodMap;
    admin_player_submenu: NuiAdminPlayerSubMenuMethodMap;
}

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;

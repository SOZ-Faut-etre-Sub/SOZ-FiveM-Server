import { NuiAdminPlayerSubMenuMethodMap } from '../../nui/components/Admin/PlayerSubMenu';
import { NuiAdminSkinSubMenuMethodMap } from '../../nui/components/Admin/SkinSubMenu';
import { NuiAudioMethodMap } from './audio';
import { NuiBennysOrderMenuMethodMap } from './bennys_order_menu';
import { NuiClipboardMethodMap } from './clipboard';
import { NuiFfsRecipeBookMethodMap } from './ffs_recipe_book';
import { NuiHealthBookMethodMap } from './health_book';
import { NuiInputMethodMap } from './input';
import { NuiMaskShopMethodMap } from './mask_shop';
import { NuiMenuMethodMap } from './menu';
import { NuiPanelMethodMap } from './panel';
import { NuiPLayerMethodMap } from './player';
import { NuiProgressMethodMap } from './progress';
import { NuiRepairMethodMap } from './repair';
import { NuiUpwOrderMenuMethodMap } from './upw_order_menu';

export interface NuiGlobalMethodMap {
    PauseMenuActive: boolean;
}

export interface NuiMethodMap {
    admin_player_submenu: NuiAdminPlayerSubMenuMethodMap;
    admin_skin_submenu: NuiAdminSkinSubMenuMethodMap;
    audio: NuiAudioMethodMap;
    bennys_order_menu: NuiBennysOrderMenuMethodMap;
    upw_order_menu: NuiUpwOrderMenuMethodMap;
    clipboard: NuiClipboardMethodMap;
    ffs_recipe_book: NuiFfsRecipeBookMethodMap;
    global: NuiGlobalMethodMap;
    health_book: NuiHealthBookMethodMap;
    input: NuiInputMethodMap;
    mask_shop: NuiMaskShopMethodMap;
    menu: NuiMenuMethodMap;
    player: NuiPLayerMethodMap;
    progress: NuiProgressMethodMap;
    panel: NuiPanelMethodMap;
    repair: NuiRepairMethodMap;
}

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;

import { NuiCardMethodMap } from '@public/shared/nui/card';
import { NuiCraftingMethodMap } from '@public/shared/nui/crafting';
import { NuiHudMethodMap } from '@public/shared/nui/hud';
import { NuiItemMethodMap } from '@public/shared/nui/item';
import { NuiMissiveMethodMap } from '@public/shared/nui/missive';
import { NuiRadioMethodMap, NuiRadioVehicleMethodMap } from '@public/shared/nui/radio';
import { NuiTalentMethodMap } from '@public/shared/nui/talent';

import { NuiAdminPlayerSubMenuMethodMap } from '../../nui/components/Admin/PlayerSubMenu';
import { NuiAdminSkinSubMenuMethodMap } from '../../nui/components/Admin/SkinSubMenu';
import { NuiAudioMethodMap } from './audio';
import { NuiBennysOrderMenuMethodMap } from './bennys_order_menu';
import { NuiClipboardMethodMap } from './clipboard';
import { NuiFfsRecipeBookMethodMap } from './ffs_recipe_book';
import { NuiHoodMethodMap } from './hood';
import { NuiInputMethodMap } from './input';
import { NuiMaskShopMethodMap } from './mask_shop';
import { NuiMenuMethodMap } from './menu';
import { NuiPanelMethodMap } from './panel';
import { NuiPLayerMethodMap } from './player';
import { NuiPoliceMethodMap } from './police';
import { NuiProgressMethodMap } from './progress';
import { NuiPlacementPropMethodMap } from './prop_placement';
import { NuiRepairMethodMap } from './repair';
import { NuiTaxiMethodMap } from './taxi';
import { NuiUpwOrderMenuMethodMap } from './upw_order_menu';

export interface NuiGlobalMethodMap {
    PauseMenuActive: boolean;
    HideHud: boolean;
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
    input: NuiInputMethodMap;
    mask_shop: NuiMaskShopMethodMap;
    menu: NuiMenuMethodMap;
    player: NuiPLayerMethodMap;
    progress: NuiProgressMethodMap;
    panel: NuiPanelMethodMap;
    talent: NuiTalentMethodMap;
    repair: NuiRepairMethodMap;
    missive: NuiMissiveMethodMap;
    police: NuiPoliceMethodMap;
    crafting: NuiCraftingMethodMap;
    item: NuiItemMethodMap;
    hood: NuiHoodMethodMap;
    taxi: NuiTaxiMethodMap;
    card: NuiCardMethodMap;
    hud: NuiHudMethodMap;
    radio: NuiRadioMethodMap;
    radio_vehicle: NuiRadioVehicleMethodMap;
    placement_prop: NuiPlacementPropMethodMap;
}

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;

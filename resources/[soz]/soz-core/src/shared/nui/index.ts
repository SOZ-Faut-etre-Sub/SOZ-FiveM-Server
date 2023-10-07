import { NuiBookMethodMap } from '@public/shared/nui/book';
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
import { NuiClothShopMethodMap } from './cloth_shop';
import { NuiCraftMethodMap } from './craft';
import { NuiDrugMethodMap } from './drug';
import { NuiFieldMethodMap } from './field';
import { NuiFishingMethodMap } from './fishing';
import { NuiHoodMethodMap } from './hood';
import { NuiInputMethodMap } from './input';
import { NuiMenuMethodMap } from './menu';
import { NuiPanelMethodMap } from './panel';
import { NuiPLayerMethodMap } from './player';
import { NuiPoliceMethodMap } from './police';
import { NuiProgressMethodMap } from './progress';
import { NuiPlacementPropMethodMap } from './prop_placement';
import { NuiRaceMethodMap } from './race';
import { NuiRepairMethodMap } from './repair';
import { NuiSozedexMethodMap } from './sozedex';
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
    cloth_shop: NuiClothShopMethodMap;
    global: NuiGlobalMethodMap;
    input: NuiInputMethodMap;
    menu: NuiMenuMethodMap;
    player: NuiPLayerMethodMap;
    progress: NuiProgressMethodMap;
    panel: NuiPanelMethodMap;
    talent: NuiTalentMethodMap;
    repair: NuiRepairMethodMap;
    missive: NuiMissiveMethodMap;
    police: NuiPoliceMethodMap;
    crafting: NuiCraftingMethodMap;
    fishing: NuiFishingMethodMap;
    item: NuiItemMethodMap;
    hood: NuiHoodMethodMap;
    taxi: NuiTaxiMethodMap;
    card: NuiCardMethodMap;
    hud: NuiHudMethodMap;
    radio: NuiRadioMethodMap;
    radio_vehicle: NuiRadioVehicleMethodMap;
    sozedex: NuiSozedexMethodMap;
    drug: NuiDrugMethodMap;
    race: NuiRaceMethodMap;
    book: NuiBookMethodMap;
    field: NuiFieldMethodMap;
    placement_prop: NuiPlacementPropMethodMap;
    craft: NuiCraftMethodMap;
}

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;

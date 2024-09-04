import { NuiBankAtmMethodMap, NuiBankMethodMap, NuiBankSafeMethodMap } from '@public/shared/nui/bank';
import { NuiBookMethodMap } from '@public/shared/nui/book';
import { NuiCardMethodMap } from '@public/shared/nui/card';
import { NuiCraftingMethodMap } from '@public/shared/nui/crafting';
import { NuiZombieMethodMap } from '@public/shared/nui/halloween';
import { NuiHudMethodMap } from '@public/shared/nui/hud';
import { NuiItemMethodMap } from '@public/shared/nui/item';
import { NuiMissiveMethodMap } from '@public/shared/nui/missive';
import { NuiRadioMethodMap, NuiRadioVehicleMethodMap } from '@public/shared/nui/radio';
import { NuiRepositoryMethodMap } from '@public/shared/nui/repository';
import { NuiSceneSearchMethodMap } from '@public/shared/nui/scene';
import { NuiTalentMethodMap } from '@public/shared/nui/talent';
import { NuiTargetMethodMap } from '@public/shared/nui/target';

import { NuiAdminPlayerSubMenuMethodMap } from '../../nui/components/Admin/PlayerSubMenu';
import { NuiAdminSkinSubMenuMethodMap } from '../../nui/components/Admin/SkinSubMenu';
import { NuiAudioMethodMap } from './audio';
import { NuiClipboardMethodMap } from './clipboard';
import { NuiClothShopMethodMap } from './cloth_shop';
import { NuiCraftMethodMap } from './craft';
import { NuiDrugMethodMap } from './drug';
import { NuiFieldMethodMap } from './field';
import { NuiFishingMethodMap } from './fishing';
import { NuiGangMethodMap } from './gang';
import { NuiHackingDeviceMethodMap } from './hacking_device';
import { NuiHoodMethodMap } from './hood';
import { NuiInputMethodMap } from './input';
import { NuiMedicalDiagMethodMap } from './medical_diag';
import { NuiMenuMethodMap } from './menu';
import { NuiMeteorMap } from './meteor';
import { NuiArrowMiniGameMethodMap } from './minigame_arrow';
import { NuiGridMiniGameMethodMap } from './minigame_grid';
import { NuiPanelMethodMap } from './panel';
import { NuiPLayerMethodMap } from './player';
import { NuiPoliceMethodMap } from './police';
import { NuiProgressMethodMap } from './progress';
import { NuiGizmoMethodMap, NuiHousingPlacementPropMethodMap, NuiPlacementPropMethodMap } from './prop_placement';
import { NuiRaceMethodMap } from './race';
import { NuiRepairMethodMap } from './repair';
import { NuiSozedexMethodMap } from './sozedex';
import { NuiTaxiMethodMap } from './taxi';
import { NuiWeatherMethodMap } from './wheather';

export interface NuiGlobalMethodMap {
    PauseMenuActive: boolean;
    HideHud: boolean;
}

export interface NuiMethodMap {
    admin_player_submenu: NuiAdminPlayerSubMenuMethodMap;
    admin_skin_submenu: NuiAdminSkinSubMenuMethodMap;
    audio: NuiAudioMethodMap;
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
    target: NuiTargetMethodMap;
    radio: NuiRadioMethodMap;
    radio_vehicle: NuiRadioVehicleMethodMap;
    sozedex: NuiSozedexMethodMap;
    drug: NuiDrugMethodMap;
    race: NuiRaceMethodMap;
    book: NuiBookMethodMap;
    field: NuiFieldMethodMap;
    placement_prop: NuiPlacementPropMethodMap;
    housing_placement_prop: NuiHousingPlacementPropMethodMap;
    gizmo: NuiGizmoMethodMap;
    craft: NuiCraftMethodMap;
    zombie: NuiZombieMethodMap;
    weather: NuiWeatherMethodMap;
    medicalDiag: NuiMedicalDiagMethodMap;
    repository: NuiRepositoryMethodMap;
    meteor: NuiMeteorMap;
    bank: NuiBankMethodMap;
    bank_atm: NuiBankAtmMethodMap;
    bank_safe: NuiBankSafeMethodMap;
    gang: NuiGangMethodMap;
    hacking_device: NuiHackingDeviceMethodMap;
    minigame_arrows: NuiArrowMiniGameMethodMap;
    minigame_grid: NuiGridMiniGameMethodMap;
    scene: NuiSceneSearchMethodMap;
}

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;

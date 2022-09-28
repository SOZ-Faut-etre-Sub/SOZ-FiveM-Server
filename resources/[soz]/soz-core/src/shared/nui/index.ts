import { NuiAdminJobSubMenuMethodMap } from '../../nui/components/Admin/JobSubMenu';
import { NuiAdminPlayerSubMenuMethodMap } from '../../nui/components/Admin/PlayerSubMenu';
import { NuiAdminVehicleSubMenuMethodMap } from '../../nui/components/Admin/VehicleSubMenu';
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
    admin_job_submenu: NuiAdminJobSubMenuMethodMap;
    admin_player_submenu: NuiAdminPlayerSubMenuMethodMap;
    admin_vehicle_submenu: NuiAdminVehicleSubMenuMethodMap;
}

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;

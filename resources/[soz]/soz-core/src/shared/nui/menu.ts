import { AdminMenuStateProps } from '../../nui/components/Admin/AdminMenu';
import { WardrobeMenuData } from '../cloth';
import { VehicleMenuData } from '../vehicle';

export interface NuiMenuMethodMap {
    ArrowDown: never;
    ArrowLeft: never;
    ArrowRight: never;
    ArrowUp: never;
    Backspace: never;
    CloseMenu: never;
    Enter: never;
    SetMenuType: SetMenuType;
}

export type SetMenuType = {
    menuType: MenuType;
    data: any;
};

export enum MenuType {
    AdminMenu = 'AdminMenu',
    BahamaUnicornJobMenu = 'baun_job_menu',
    BennysOrderMenu = 'bennys_order_menu',
    StonkJobMenu = 'stonk_job_menu',
    FightForStyleJobMenu = 'ffs_job_menu',
    FoodJobMenu = 'food_job_menu',
    Demo = 'demo',
    BossShop = 'boss_shop',
    MaskShop = 'mask_shop',
    SetHealthState = 'set_health_state',
    Vehicle = 'vehicle_menu',
    Wardrobe = 'wardrobe',
}

export interface MenuTypeMap extends Record<MenuType, unknown> {
    [MenuType.AdminMenu]: AdminMenuStateProps['data'];
    [MenuType.BahamaUnicornJobMenu]: any;
    [MenuType.FightForStyleJobMenu]: any;
    [MenuType.Demo]: never;
    [MenuType.SetHealthState]: number;
    [MenuType.Wardrobe]: WardrobeMenuData;
    [MenuType.Vehicle]: VehicleMenuData;
}

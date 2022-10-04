import { Wardrobe, WardrobeMenuData } from '../cloth';

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
    BahamaUnicornJobMenu = 'baun_job_menu',
    FightForStyleJobMenu = 'ffs_job_menu',
    FoodJobMenu = 'food_job_menu',
    Demo = 'demo',
    SetHealthState = 'set_health_state',
    Wardrobe = 'wardrobe',
}

export interface MenuTypeMap extends Record<MenuType, unknown> {
    [MenuType.BahamaUnicornJobMenu]: any;
    [MenuType.FightForStyleJobMenu]: any;
    [MenuType.Demo]: never;
    [MenuType.SetHealthState]: number;
    [MenuType.Wardrobe]: WardrobeMenuData;
}

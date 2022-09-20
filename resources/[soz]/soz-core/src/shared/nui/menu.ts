export interface NuiMenuMethodMap {
    ArrowDown: never;
    ArrowLeft: never;
    ArrowRight: never;
    ArrowUp: never;
    Backspace: never;
    CloseMenu: never;
    Enter: never;
    SetMenuType: SetMenuType;

    MenuHealthSetSource: number;
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
}

export interface MenuTypeMap extends Record<MenuType, unknown> {
    [MenuType.BahamaUnicornJobMenu]: any;
    [MenuType.FightForStyleJobMenu]: any;
    [MenuType.Demo]: never;
    [MenuType.SetHealthState]: number;
}

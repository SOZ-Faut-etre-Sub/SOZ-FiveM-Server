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
    Demo = 'demo',
    SetHealthState = 'set_health_state',
    FfsRecipeBook = 'ffs_recipe_book',
}

export interface MenuTypeMap extends Record<MenuType, unknown> {
    [MenuType.Demo]: never;
    [MenuType.SetHealthState]: number;
}

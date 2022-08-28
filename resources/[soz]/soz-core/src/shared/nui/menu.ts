export interface NuiMenuMethodMap {
    ArrowDown: never;
    ArrowLeft: never;
    ArrowRight: never;
    ArrowUp: never;
    Backspace: never;
    CloseMenu: never;
    Enter: never;
    SetMenuType: MenuType;
}

export enum MenuType {
    Demo = 'demo',
    SetHealthState = 'set_health_state',
}

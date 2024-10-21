export enum WeaponComponentType {
    Clip = 'clip',
    Flashlight = 'flashlight',
    Suppressor = 'suppressor',
    Scope = 'scope',
    Grip = 'grip',
    PrimarySkin = 'primary_skin',
    SecondarySkin = 'secondary_skin',
}

export type WeaponAttachment = {
    label: string;
    component: string;
    type: WeaponComponentType;
};

export const WEAPON_CUSTOM_PRICE = {
    label: 1350,
    repair: 90, // per percentage price
    tint: 1350,
    attachment: 36000,
};

export const REPAIR_HEALTH_REDUCER = 0.95; // 5% health loss

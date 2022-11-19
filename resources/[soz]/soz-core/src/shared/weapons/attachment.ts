export enum WeaponComponentType {
    Clip = 'clip',
    Flashlight = 'flashlight',
    Suppressor = 'suppressor',
    Scope = 'scope',
    Grip = 'grip',
    Skin = 'skin',
}

export type WeaponAttachment = {
    label: string;
    component: string;
    type: WeaponComponentType;
};

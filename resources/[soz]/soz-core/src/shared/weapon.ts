import { Vector3 } from './polyzone/vector';

export const WeaponAmmo = {
    pistol_ammo: 12,
    rifle_ammo: 30,
    smg_ammo: 20,
    shotgun_ammo: 10,
    mg_ammo: 30,
    snp_ammo: 10,
};

export const GlobalWeaponConfig = {
    MaxAmmoRefill: 3,
    MaxHealth: 200,
    RecoilOnUsedWeapon: 5.0,
};

export type WeaponOnBack = {
    model: number;
    position: Vector3;
    rotation: Vector3;
};

export type WeaponConfig = {
    hash: number;
    recoil?: number;
    drawOnBack?: WeaponOnBack;
};

export enum WeaponName {
    // Melee
    UNARMED = 'WEAPON_UNARMED',
    // Handguns
    PISTOL = 'WEAPON_PISTOL',
    PUMPSHOTGUN = 'WEAPON_PUMPSHOTGUN',
    PUMPSHOTGUN_MK2 = 'WEAPON_PUMPSHOTGUN_MK2',
    HEAVYSHOTGUN = 'WEAPON_HEAVYSHOTGUN',
    // Shotguns
    MUSKET = 'WEAPON_MUSKET',
    // Assault Rifles
    ASSAULTRIFLE = 'WEAPON_ASSAULTRIFLE',
    ASSAULTRIFLE_MK2 = 'WEAPON_ASSAULTRIFLE_MK2',
    ADVANCEDRIFLE = 'WEAPON_ADVANCEDRIFLE',
    CARBINERIFLE = 'WEAPON_CARBINERIFLE',
    CARBINERIFLE_MK2 = 'WEAPON_CARBINERIFLE_MK2',
    // Sniper
    SNIPERRIFLE = 'WEAPON_SNIPERRIFLE',
    HEAVYSNIPER = 'WEAPON_HEAVYSNIPER',
    // Launcher
    RPG = 'WEAPON_RPG',
}

export const Weapons: Record<WeaponName, WeaponConfig> = {
    // Melee
    [WeaponName.UNARMED]: {
        hash: GetHashKey(WeaponName.UNARMED),
        recoil: 0,
    },
    // Handguns
    [WeaponName.PISTOL]: {
        hash: GetHashKey(WeaponName.PISTOL),
        recoil: 0.3,
    },
    // Shotguns
    [WeaponName.PUMPSHOTGUN]: {
        hash: GetHashKey(WeaponName.PUMPSHOTGUN),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sg_pumpshotgun'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
    },
    [WeaponName.PUMPSHOTGUN_MK2]: {
        hash: GetHashKey(WeaponName.PUMPSHOTGUN_MK2),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sg_pumpshotgunmk2'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
    },
    [WeaponName.HEAVYSHOTGUN]: {
        hash: GetHashKey(WeaponName.HEAVYSHOTGUN),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sg_heavyshotgun'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
    },
    [WeaponName.MUSKET]: {
        hash: GetHashKey(WeaponName.MUSKET),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_musket'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
    },
    // Assault Rifles
    [WeaponName.ASSAULTRIFLE]: {
        hash: GetHashKey(WeaponName.ASSAULTRIFLE),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_assaultrifle'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
    },
    [WeaponName.ASSAULTRIFLE_MK2]: {
        hash: GetHashKey(WeaponName.ASSAULTRIFLE_MK2),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_assaultriflemk2'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
    },
    [WeaponName.ADVANCEDRIFLE]: {
        hash: GetHashKey(WeaponName.ADVANCEDRIFLE),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_advancedrifle'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
    },
    [WeaponName.CARBINERIFLE]: {
        hash: GetHashKey(WeaponName.CARBINERIFLE),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_carbinerifle'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
    },
    [WeaponName.CARBINERIFLE_MK2]: {
        hash: GetHashKey(WeaponName.CARBINERIFLE_MK2),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_carbineriflemk2'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
    },
    // Sniper
    [WeaponName.SNIPERRIFLE]: {
        hash: GetHashKey(WeaponName.SNIPERRIFLE),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sr_sniperrifle'), position: [0.173, -0.14, -0.02], rotation: [0, 20, 0] },
    },
    [WeaponName.HEAVYSNIPER]: {
        hash: GetHashKey(WeaponName.HEAVYSNIPER),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sr_heavysniper'), position: [0.173, -0.14, -0.02], rotation: [0, 20, 0] },
    },
    // Launcher
    [WeaponName.RPG]: {
        hash: GetHashKey(WeaponName.RPG),
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_lr_rpg'), position: [0.173, -0.14, -0.02], rotation: [0, 150, 0] },
    },
};

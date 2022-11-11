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

export type WeaponConfig = {
    hash: number;
    recoil?: number;
};

export enum WeaponName {
    UNARMED = 'WEAPON_UNARMED',
    PISTOL = 'WEAPON_PISTOL',
}

export const Weapons: Record<WeaponName, WeaponConfig> = {
    [WeaponName.UNARMED]: {
        hash: GetHashKey(WeaponName.UNARMED),
        recoil: 0,
    },
    [WeaponName.PISTOL]: {
        hash: GetHashKey(WeaponName.PISTOL),
        recoil: 0.3,
    },
};

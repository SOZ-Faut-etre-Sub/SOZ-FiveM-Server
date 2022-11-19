import { Vector3 } from '../polyzone/vector';

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

enum WeaponComponentType {
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

export type WeaponConfig = {
    recoil?: number;
    drawOnBack?: WeaponOnBack;
    attachments: WeaponAttachment[];
};

export enum WeaponName {
    // Melee
    UNARMED = 'WEAPON_UNARMED',
    // KNIFE = 'WEAPON_KNIFE',
    // NIGHTSTICK = 'WEAPON_NIGHTSTICK',
    // HAMMER = 'WEAPON_HAMMER',
    // BAT = 'WEAPON_BAT',
    // GOLFCLUB = 'WEAPON_GOLFCLUB',
    // CROWBAR = 'WEAPON_CROWBAR',
    // Handguns
    PISTOL = 'WEAPON_PISTOL',
    COMBATPISTOL = 'WEAPON_COMBATPISTOL',
    APPISTOL = 'WEAPON_APPISTOL',
    PISTOL50 = 'WEAPON_PISTOL50',
    REVOLVER = 'WEAPON_REVOLVER',
    SNSPISTOL = 'WEAPON_SNSPISTOL',
    HEAVYPISTOL = 'WEAPON_HEAVYPISTOL',
    VINTAGEPISTOL = 'WEAPON_VINTAGEPISTOL',
    STUNGUN = 'WEAPON_STUNGUN',
    // SMG
    MICROSMG = 'WEAPON_MICROSMG',
    SMG = 'WEAPON_SMG',
    ASSAULTSMG = 'WEAPON_ASSAULTSMG',
    MINISMG = 'WEAPON_MINISMG',
    MACHINEPISTOL = 'WEAPON_MACHINEPISTOL',
    COMBATPDW = 'WEAPON_COMBATPDW',
    // Shotguns
    PUMPSHOTGUN = 'WEAPON_PUMPSHOTGUN',
    PUMPSHOTGUN_MK2 = 'WEAPON_PUMPSHOTGUN_MK2',
    ASSAULTSHOTGUN = 'WEAPON_ASSAULTSHOTGUN',
    BULLPUPSHOTGUN = 'WEAPON_BULLPUPSHOTGUN',
    HEAVYSHOTGUN = 'WEAPON_HEAVYSHOTGUN',
    COMBATSHOTGUN = 'WEAPON_COMBATSHOTGUN',
    MUSKET = 'WEAPON_MUSKET',
    SAWNOFFSHOTGUN = 'WEAPON_SAWNOFFSHOTGUN',
    // Assault Rifles
    ASSAULTRIFLE = 'WEAPON_ASSAULTRIFLE',
    ASSAULTRIFLE_MK2 = 'WEAPON_ASSAULTRIFLE_MK2',
    ADVANCEDRIFLE = 'WEAPON_ADVANCEDRIFLE',
    CARBINERIFLE = 'WEAPON_CARBINERIFLE',
    CARBINERIFLE_MK2 = 'WEAPON_CARBINERIFLE_MK2',
    SPECIALCARBINE = 'WEAPON_SPECIALCARBINE',
    BULLPUPRIFLE = 'WEAPON_BULLPUPRIFLE',
    COMPACTRIFLE = 'WEAPON_COMPACTRIFLE',
    // Machine Guns
    MG = 'WEAPON_MG',
    COMBATMG = 'WEAPON_COMBATMG',
    GUSENBERG = 'WEAPON_GUSENBERG',
    // Sniper
    SNIPERRIFLE = 'WEAPON_SNIPERRIFLE',
    HEAVYSNIPER = 'WEAPON_HEAVYSNIPER',
    MARKSMANRIFLE = 'WEAPON_MARKSMANRIFLE',
    // Launcher
    RPG = 'WEAPON_RPG',
    GRENADELAUNCHER = 'WEAPON_GRENADELAUNCHER',
    // GRENADE = 'WEAPON_GRENADE',
    // STICKYBOMB = 'WEAPON_STICKYBOMB',
    // MOLOTOV = 'WEAPON_MOLOTOV',
    // SMOKEGRENADE = 'WEAPON_SMOKEGRENADE',
    // BZGAS = 'WEAPON_BZGAS',
    // FLARE = 'WEAPON_FLARE',
    // BALL = 'WEAPON_BALL',
    // SNOWBALL = 'WEAPON_SNOWBALL',
}

export const Weapons: Record<WeaponName, WeaponConfig> = {
    // Melee
    [WeaponName.UNARMED]: {
        recoil: 0,
        attachments: [],
    },
    // Handguns
    [WeaponName.PISTOL]: {
        recoil: 0.3,
        drawOnBack: { model: GetHashKey('w_pi_pistol'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_PISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_PISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_PISTOL_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.COMBATPISTOL]: {
        recoil: 0.3,
        drawOnBack: { model: GetHashKey('w_pi_combatpistol'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_COMBATPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_COMBATPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_COMBATPISTOL_VARMOD_LOWRIDER', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.APPISTOL]: {
        recoil: 0.3,
        drawOnBack: { model: GetHashKey('w_pi_appistol'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_APPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_APPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Skin luxe', component: 'COMPONENT_APPISTOL_VARMOD_LUXE', type: WeaponComponentType.Skin },
            { label: 'Skin secu', component: 'COMPONENT_APPISTOL_VARMOD_SECURITY', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.PISTOL50]: {
        recoil: 0.3,
        drawOnBack: { model: GetHashKey('w_pi_pistol50'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_PISTOL50_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_PISTOL50_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_PISTOL50_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.REVOLVER]: {
        recoil: 0.3,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_REVOLVER_CLIP_01', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.SNSPISTOL]: {
        recoil: 0.3,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_SNSPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_SNSPISTOL_CLIP_02', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.HEAVYPISTOL]: {
        recoil: 0.3,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_HEAVYPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_HEAVYPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.VINTAGEPISTOL]: {
        recoil: 0.3,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_VINTAGEPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_VINTAGEPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.STUNGUN]: {
        recoil: 0.1,
        drawOnBack: { model: GetHashKey('w_pi_stungun'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [],
    },
    // SMGs
    [WeaponName.MICROSMG]: {
        recoil: 0.2,
        drawOnBack: { model: GetHashKey('w_sb_microsmg'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MICROSMG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MICROSMG_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_MACRO', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_MICROSMG_VARMOD_LUXE', type: WeaponComponentType.Skin },
            { label: 'Skin', component: 'COMPONENT_MICROSMG_VARMOD_SECURITY', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.SMG]: {
        recoil: 0.2,
        drawOnBack: { model: GetHashKey('w_sb_smg'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_SMG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_SMG_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_SMG_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_MACRO_02', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_SMG_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.ASSAULTSMG]: {
        recoil: 0.2,
        drawOnBack: { model: GetHashKey('w_sb_assaultsmg'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_ASSAULTSMG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_ASSAULTSMG_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_MACRO', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_ASSAULTSMG_VARMOD_LOWRIDER', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.MINISMG]: {
        recoil: 0.2,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MINISMG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MINISMG_CLIP_02', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.MACHINEPISTOL]: {
        recoil: 0.2,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MACHINEPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MACHINEPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_MACHINEPISTOL_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.COMBATPDW]: {
        recoil: 0.2,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_COMBATPDW_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_COMBATPDW_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_COMBATPDW_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL', type: WeaponComponentType.Scope },
        ],
    },
    // Shotguns
    [WeaponName.PUMPSHOTGUN]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sg_pumpshotgun'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_PUMPSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_SR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_PUMPSHOTGUN_VARMOD_LOWRIDER', type: WeaponComponentType.Skin },
            { label: 'Skin secu', component: 'COMPONENT_PUMPSHOTGUN_VARMOD_SECURITY', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.PUMPSHOTGUN_MK2]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sg_pumpshotgunmk2'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [],
    },
    [WeaponName.ASSAULTSHOTGUN]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sg_assaultshotgun'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_ASSAULTSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_ASSAULTSHOTGUN_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.BULLPUPSHOTGUN]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sg_bullpupshotgun'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_BULLPUPSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.HEAVYSHOTGUN]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sg_heavyshotgun'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_HEAVYSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_HEAVYSHOTGUN_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_HEAVYSHOTGUN_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.COMBATSHOTGUN]: {
        recoil: 0.5,
        attachments: [
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.SAWNOFFSHOTGUN]: {
        recoil: 0.5,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_SAWNOFFSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Skin', component: 'COMPONENT_SAWNOFFSHOTGUN_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.MUSKET]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_musket'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
        attachments: [],
    },
    // Assault Rifles
    [WeaponName.ASSAULTRIFLE]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_assaultrifle'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_ASSAULTRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_ASSAULTRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_ASSAULTRIFLE_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_MACRO', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
            { label: 'Lux', component: 'COMPONENT_ASSAULTRIFLE_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.ASSAULTRIFLE_MK2]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_assaultriflemk2'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
        attachments: [],
    },
    [WeaponName.ADVANCEDRIFLE]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_advancedrifle'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_ADVANCEDRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_ADVANCEDRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_ADVANCEDRIFLE_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.CARBINERIFLE]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_carbinerifle'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_CARBINERIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_CARBINERIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_CARBINERIFLE_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Flashlight', component: 'COMPONENT_AT_RAILCOVER_01', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_MEDIUM', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
            { label: 'Lux', component: 'COMPONENT_CARBINERIFLE_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.CARBINERIFLE_MK2]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_ar_carbineriflemk2'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
        attachments: [],
    },
    [WeaponName.SPECIALCARBINE]: {
        recoil: 0.5,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_SPECIALCARBINE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_SPECIALCARBINE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_SPECIALCARBINE_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_MEDIUM', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.BULLPUPRIFLE]: {
        recoil: 0.5,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_BULLPUPRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_BULLPUPRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.COMPACTRIFLE]: {
        recoil: 0.5,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_COMPACTRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_COMPACTRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_COMPACTRIFLE_CLIP_03', type: WeaponComponentType.Clip },
        ],
    },
    // Machine Guns
    [WeaponName.MG]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_mg_mg'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MG_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL_02', type: WeaponComponentType.Scope },
            { label: 'Skin', component: 'COMPONENT_MG_VARMOD_LOWRIDER', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.COMBATMG]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_mg_combatmg'), position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_COMBATMG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_COMBATMG_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_MEDIUM', type: WeaponComponentType.Scope },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
            { label: 'Skin', component: 'COMPONENT_COMBATMG_VARMOD_LOWRIDER', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.GUSENBERG]: {
        recoil: 0.5,
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_GUSENBERG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_GUSENBERG_CLIP_02', type: WeaponComponentType.Clip },
        ],
    },
    // Sniper
    [WeaponName.SNIPERRIFLE]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sr_sniperrifle'), position: [0.173, -0.14, -0.02], rotation: [0, 20, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_SNIPERRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_LARGE', type: WeaponComponentType.Scope },
            { label: 'Adv Scope', component: 'COMPONENT_AT_SCOPE_MAX', type: WeaponComponentType.Scope },
            { label: 'Skin', component: 'COMPONENT_SNIPERRIFLE_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.HEAVYSNIPER]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sr_heavysniper'), position: [0.173, -0.14, -0.02], rotation: [0, 20, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_HEAVYSNIPER_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_LARGE', type: WeaponComponentType.Scope },
            { label: 'Adv Scope', component: 'COMPONENT_AT_SCOPE_MAX', type: WeaponComponentType.Scope },
        ],
    },
    [WeaponName.MARKSMANRIFLE]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_sr_heavysniper'), position: [0.173, -0.14, -0.02], rotation: [0, 20, 0] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MARKSMANRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MARKSMANRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_LARGE_FIXED_ZOOM', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    // Launcher
    [WeaponName.RPG]: {
        recoil: 0.5,
        drawOnBack: { model: GetHashKey('w_lr_rpg'), position: [0.173, -0.14, -0.02], rotation: [0, 150, 0] },
        attachments: [{ label: 'Default Clip', component: 'COMPONENT_RPG_CLIP_01', type: WeaponComponentType.Clip }],
    },
    [WeaponName.GRENADELAUNCHER]: {
        recoil: 0.5,
        drawOnBack: {
            model: GetHashKey('w_lr_grenadelauncher'),
            position: [0.173, -0.14, -0.02],
            rotation: [0, 150, 0],
        },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_GRENADELAUNCHER_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL', type: WeaponComponentType.Scope },
        ],
    },
};

import { InventoryItem } from '../item';
import { Vector3 } from '../polyzone/vector';
import { WeaponAttachment, WeaponComponentType } from './attachment';
import { WeaponTintColor, WeaponTintColorChoiceItem } from './tint';

export type WeaponsMenuData = {
    weapons: InventoryItem[];
    tints: { slot: number; tints: Record<WeaponTintColor, WeaponTintColorChoiceItem> }[];
    attachments: { slot: number; attachments: WeaponAttachment[] }[];
};

export const WeaponAmmo = {
    ammo_01: 10,
    ammo_02: 10,
    ammo_03: 10,
    ammo_04: 10,
    ammo_05: 10,
    ammo_06: 10,
    ammo_07: 10,
    ammo_08: 10,
    ammo_09: 10,
    ammo_10: 10,
    ammo_11: 10,
    ammo_12: 10,
    ammo_13: 10,
    ammo_14: 10,
    ammo_15: 10,
    ammo_16: 10,
};

export const GlobalWeaponConfig = {
    MaxAmmoRefill: 3,
    MaxHealth: 2000,
    RecoilOnUsedWeapon: 5.0,
};

export const DrawPositions: Record<string, Omit<WeaponDrawPosition, 'model'>> = {
    AR: { position: [0.173, -0.14, 0.05], rotation: [0, 0, 0] },
    SMG: { position: [0.173, 0.147, -0.02], rotation: [0, 45, 0] },
    RPG: { position: [0.173, -0.14, -0.02], rotation: [0, 0, 0] }, // RPG & Sniper
    LMG: { position: [0.05, -0.14, -0.15], rotation: [0, 45, 0] }, // Pompe & LMG & Corps à corps
};

export type WeaponDrawPosition = {
    model: number;
    position: Vector3;
    rotation: Vector3;
};

export type WeaponConfig = {
    recoil?: number;
    ammo?:
        | 'ammo_01'
        | 'ammo_02'
        | 'ammo_03'
        | 'ammo_04'
        | 'ammo_05'
        | 'ammo_06'
        | 'ammo_07'
        | 'ammo_08'
        | 'ammo_09'
        | 'ammo_10'
        | 'ammo_11'
        | 'ammo_12'
        | 'ammo_13'
        | 'ammo_14'
        | 'ammo_15'
        | 'ammo_16';
    drawPosition?: WeaponDrawPosition;
    attachments?: WeaponAttachment[];
};

export enum WeaponName {
    // Melee
    BAT = 'WEAPON_BAT',
    CROWBAR = 'WEAPON_CROWBAR',
    FLASHLIGHT = 'WEAPON_FLASHLIGHT',
    GOLFCLUB = 'WEAPON_GOLFCLUB',
    HAMMER = 'WEAPON_HAMMER',
    KNUCKLE = 'WEAPON_KNUCKLE',
    NIGHTSTICK = 'WEAPON_NIGHTSTICK',
    WRENCH = 'WEAPON_WRENCH',
    POOLCUE = 'WEAPON_POOLCUE',
    UNARMED = 'WEAPON_UNARMED',
    DAGGER = 'WEAPON_DAGGER',
    BOTTE = 'WEAPON_BOTTLE',
    HATCHET = 'WEAPON_HATCHET',
    KNIFE = 'WEAPON_KNIFE',
    MACHETE = 'WEAPON_MACHETE',
    SWITCHBLADE = 'WEAPON_SWITCHBLADE',
    BATTLEAXE = 'WEAPON_BATTLEAXE',
    STONE_HATCHET = 'WEAPON_STONE_HATCHET',

    // Handguns
    PISTOL = 'WEAPON_PISTOL',
    PISTOL_MK2 = 'WEAPON_PISTOL_MK2',
    REVOLVER_MK2 = 'WEAPON_REVOLVER_MK2',
    STUNGUN = 'WEAPON_STUNGUN',
    COMBATPISTOL = 'WEAPON_COMBATPISTOL',
    APPISTOL = 'WEAPON_APPISTOL',
    PISTOL50 = 'WEAPON_PISTOL50',
    SNSPISTOL = 'WEAPON_SNSPISTOL',
    HEAVYPISTOL = 'WEAPON_HEAVYPISTOL',
    VINTAGEPISTOL = 'WEAPON_VINTAGEPISTOL',
    FLAREGUN = 'WEAPON_FLAREGUN',
    MARKSMANPISTOL = 'WEAPON_MARKSMANPISTOL',
    REVOLVER = 'WEAPON_REVOLVER',
    DOUBLEACTION = 'WEAPON_DOUBLEACTION',
    SNSPISTOL_MK2 = 'WEAPON_SNSPISTOL_MK2',
    RAYPISTOL = 'WEAPON_RAYPISTOL',
    CERAMICPISTOL = 'WEAPON_CERAMICPISTOL',
    NAVYREVOLVER = 'WEAPON_NAVYREVOLVER',
    GADGETPISTOL = 'WEAPON_GADGETPISTOL',

    // SMG
    MICROSMG = 'WEAPON_MICROSMG',
    SMG = 'WEAPON_SMG',
    ASSAULTSMG = 'WEAPON_ASSAULTSMG',
    COMBATPDW = 'WEAPON_COMBATPDW',
    SMG_MK2 = 'WEAPON_SMG_MK2',
    MACHINEPISTOL = 'WEAPON_MACHINEPISTOL',
    MINISMG = 'WEAPON_MINISMG',
    RAYCARBINE = 'WEAPON_RAYCARBINE',

    // Assault Rifles
    ASSAULTRIFLE = 'WEAPON_ASSAULTRIFLE',
    ASSAULTRIFLE_MK2 = 'WEAPON_ASSAULTRIFLE_MK2',
    CARBINERIFLE = 'WEAPON_CARBINERIFLE',
    CARBINERIFLE_MK2 = 'WEAPON_CARBINERIFLE_MK2',
    ADVANCEDRIFLE = 'WEAPON_ADVANCEDRIFLE',
    SPECIALCARBINE = 'WEAPON_SPECIALCARBINE',
    BULLPUPRIFLE = 'WEAPON_BULLPUPRIFLE',
    COMPACTRIFLE = 'WEAPON_COMPACTRIFLE',
    SPECIALCARBINE_MK2 = 'WEAPON_SPECIALCARBINE_MK2',
    BULLPUPRIFLE_MK2 = 'WEAPON_BULLPUPRIFLE_MK2',
    MILITARYRIFLE = 'WEAPON_MILITARYRIFLE',
    HEAVYRIFLE = 'WEAPON_HEAVYRIFLE',
    TACTICALRIFLE = 'WEAPON_TACTICALRIFLE',

    // Shotguns
    PUMPSHOTGUN = 'WEAPON_PUMPSHOTGUN',
    SAWNOFFSHOTGUN = 'WEAPON_SAWNOFFSHOTGUN',
    ASSAULTSHOTGUN = 'WEAPON_ASSAULTSHOTGUN',
    BULLPUPSHOTGUN = 'WEAPON_BULLPUPSHOTGUN',
    MUSKET = 'WEAPON_MUSKET',
    HEAVYSHOTGUN = 'WEAPON_HEAVYSHOTGUN',
    DBSHOTGUN = 'WEAPON_DBSHOTGUN',
    AUTOSHOTGUN = 'WEAPON_AUTOSHOTGUN',
    PUMPSHOTGUN_MK2 = 'WEAPON_PUMPSHOTGUN_MK2',
    COMBATSHOTGUN = 'WEAPON_COMBATSHOTGUN',

    // Machine Guns
    MG = 'WEAPON_MG',
    COMBATMG = 'WEAPON_COMBATMG',
    GUSENBERG = 'WEAPON_GUSENBERG',
    COMBATMG_MK2 = 'WEAPON_COMBATMG_MK2',

    // Heavy Weapons
    RPG = 'WEAPON_RPG',
    GRENADELAUNCHER = 'WEAPON_GRENADELAUNCHER',
    GRENADELAUNCHER_SMOKE = 'WEAPON_GRENADELAUNCHER_SMOKE',
    MINIGUN = 'WEAPON_MINIGUN',
    FIREWORK = 'WEAPON_FIREWORK',
    RAILGUN = 'WEAPON_RAILGUN',
    HOMINGLAUNCHER = 'WEAPON_HOMINGLAUNCHER',
    COMPACTLAUNCHER = 'WEAPON_COMPACTLAUNCHER',
    RAYMINIGUN = 'WEAPON_RAYMINIGUN',
    EMPLAUNCHER = 'WEAPON_EMPLAUNCHER',

    // Sniper Rifles
    SNIPERRIFLE = 'WEAPON_SNIPERRIFLE',
    HEAVYSNIPER = 'WEAPON_HEAVYSNIPER',
    HEAVYSNIPER_MK2 = 'WEAPON_HEAVYSNIPER_MK2',
    MARKSMANRIFLE = 'WEAPON_MARKSMANRIFLE',
    MARKSMANRIFLE_MK2 = 'WEAPON_MARKSMANRIFLE_MK2',
    PRECISIONRIFLE = 'WEAPON_PRECISIONRIFLE',

    // Launcher
    GRENADE = 'WEAPON_GRENADE',
    BZGAS = 'WEAPON_BZGAS',
    MOLOTOV = 'WEAPON_MOLOTOV',
    STICKYBOMB = 'WEAPON_STICKYBOMB',
    PROXMINE = 'WEAPON_PROXMINE',
    SNOWBALL = 'WEAPON_SNOWBALL',
    PIPEBOMB = 'WEAPON_PIPEBOMB',
    BALL = 'WEAPON_BALL',
    SMOKEGRENADE = 'WEAPON_SMOKEGRENADE',
    FLARE = 'WEAPON_FLARE',

    // Other
    PETROLCAN = 'WEAPON_PETROLCAN',
    FIREEXTINGUISHER = 'WEAPON_FIREEXTINGUISHER',
    HAZARDCAN = 'WEAPON_HAZARDCAN',
}

export const Weapons: Record<WeaponName, WeaponConfig> = {
    // Melee
    [WeaponName.BAT]: {
        drawPosition: { model: GetHashKey('w_me_bat'), ...DrawPositions['LMG'] },
    },
    [WeaponName.CROWBAR]: {
        drawPosition: { model: GetHashKey('w_me_crowbar'), ...DrawPositions['LMG'] },
    },
    [WeaponName.FLASHLIGHT]: {},
    [WeaponName.GOLFCLUB]: {
        drawPosition: { model: GetHashKey('w_me_gclub'), ...DrawPositions['LMG'] },
    },
    [WeaponName.HAMMER]: {},
    [WeaponName.KNUCKLE]: {},
    [WeaponName.NIGHTSTICK]: {},
    [WeaponName.WRENCH]: {
        drawPosition: { model: GetHashKey('prop_tool_wrench'), ...DrawPositions['LMG'] },
    },
    [WeaponName.POOLCUE]: {
        drawPosition: { model: GetHashKey('prop_pool_cue'), ...DrawPositions['LMG'] },
    },
    [WeaponName.UNARMED]: {},
    [WeaponName.DAGGER]: {},
    [WeaponName.BOTTE]: {},
    [WeaponName.HATCHET]: {
        drawPosition: { model: GetHashKey('w_me_hatchet'), ...DrawPositions['LMG'] },
    },
    [WeaponName.KNIFE]: {},
    [WeaponName.MACHETE]: {
        drawPosition: { model: GetHashKey('prop_ld_w_me_machette'), ...DrawPositions['LMG'] },
    },
    [WeaponName.SWITCHBLADE]: {},
    [WeaponName.BATTLEAXE]: {
        drawPosition: { model: GetHashKey('w_me_battleaxe'), ...DrawPositions['LMG'] },
    },
    [WeaponName.STONE_HATCHET]: {
        drawPosition: { model: GetHashKey('w_me_stonehatchet'), ...DrawPositions['LMG'] },
    },

    // Handguns
    [WeaponName.PISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_PISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_PISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.PISTOL_MK2]: {
        recoil: 0.3,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_PISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_PISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.REVOLVER_MK2]: {
        recoil: 0.3,
        ammo: 'ammo_02',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_REVOLVER_CLIP_01', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.STUNGUN]: {
        recoil: 0.1,
        drawPosition: { model: GetHashKey('w_pi_stungun'), position: [0.173, -0.14, -0.02], rotation: [0, 45, 0] },
    },
    [WeaponName.COMBATPISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_COMBATPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_COMBATPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.APPISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
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
        ammo: 'ammo_02',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_PISTOL50_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_PISTOL50_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_PISTOL50_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.SNSPISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_SNSPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_SNSPISTOL_CLIP_02', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.HEAVYPISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_HEAVYPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_HEAVYPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_PI_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.VINTAGEPISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_VINTAGEPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_VINTAGEPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.FLAREGUN]: {
        recoil: 0.3,
        ammo: 'ammo_03',
    },
    [WeaponName.MARKSMANPISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
    },
    [WeaponName.REVOLVER]: {
        recoil: 0.3,
        ammo: 'ammo_02',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_REVOLVER_CLIP_01', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.DOUBLEACTION]: {
        recoil: 0.3,
        ammo: 'ammo_02',
    },
    [WeaponName.SNSPISTOL_MK2]: {
        recoil: 0.3,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_SNSPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_SNSPISTOL_CLIP_02', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.RAYPISTOL]: {
        recoil: 0.3,
    },
    [WeaponName.CERAMICPISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
    },
    [WeaponName.NAVYREVOLVER]: {
        recoil: 0.3,
        ammo: 'ammo_02',
    },
    [WeaponName.GADGETPISTOL]: {
        recoil: 0.3,
        ammo: 'ammo_01',
    },

    // SMGs
    [WeaponName.MICROSMG]: {
        recoil: 0.2,
        ammo: 'ammo_01',
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
        ammo: 'ammo_01',
        drawPosition: { model: GetHashKey('w_sb_smg'), ...DrawPositions['SMG'] },
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
        ammo: 'ammo_04',
        drawPosition: { model: GetHashKey('w_sb_assaultsmg'), ...DrawPositions['SMG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_ASSAULTSMG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_ASSAULTSMG_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_MACRO', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_ASSAULTSMG_VARMOD_LOWRIDER', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.COMBATPDW]: {
        recoil: 0.2,
        ammo: 'ammo_01',
        drawPosition: { model: GetHashKey('w_sb_pdw'), ...DrawPositions['SMG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_COMBATPDW_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_COMBATPDW_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_COMBATPDW_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL', type: WeaponComponentType.Scope },
        ],
    },
    [WeaponName.SMG_MK2]: {
        recoil: 0.2,
        ammo: 'ammo_04',
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
    [WeaponName.MACHINEPISTOL]: {
        recoil: 0.2,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MACHINEPISTOL_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MACHINEPISTOL_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_MACHINEPISTOL_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Suppressor', component: 'COMPONENT_AT_PI_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },
    [WeaponName.MINISMG]: {
        recoil: 0.2,
        ammo: 'ammo_01',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MINISMG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MINISMG_CLIP_02', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.RAYCARBINE]: {
        recoil: 0.2,
        ammo: 'ammo_14',
        drawPosition: { model: GetHashKey('w_sb_assaultsmg'), ...DrawPositions['SMG'] },
    },

    // Assault Rifles
    [WeaponName.ASSAULTRIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_05',
        drawPosition: { model: GetHashKey('w_ar_assaultrifle'), ...DrawPositions['AR'] },
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
        ammo: 'ammo_05',
        drawPosition: { model: GetHashKey('w_ar_assaultriflemk2'), ...DrawPositions['AR'] },
    },
    [WeaponName.CARBINERIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_06',
        drawPosition: { model: GetHashKey('w_ar_carbinerifle'), ...DrawPositions['AR'] },
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
        ammo: 'ammo_06',
        drawPosition: { model: GetHashKey('w_ar_carbineriflemk2'), ...DrawPositions['AR'] },
    },
    [WeaponName.ADVANCEDRIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_07',
        drawPosition: { model: GetHashKey('w_ar_advancedrifle'), ...DrawPositions['AR'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_ADVANCEDRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_ADVANCEDRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_ADVANCEDRIFLE_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.SPECIALCARBINE]: {
        recoil: 0.5,
        ammo: 'ammo_06',
        drawPosition: { model: GetHashKey('w_ar_specialcarbine'), ...DrawPositions['AR'] },
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
        ammo: 'ammo_06',
        drawPosition: { model: GetHashKey('w_ar_bullpuprifle'), ...DrawPositions['AR'] },
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
        ammo: 'ammo_06',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_COMPACTRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_COMPACTRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_COMPACTRIFLE_CLIP_03', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.SPECIALCARBINE_MK2]: {
        recoil: 0.5,
        ammo: 'ammo_06',
        drawPosition: { model: GetHashKey('w_ar_specialcarbinemk2'), ...DrawPositions['AR'] },
    },
    [WeaponName.BULLPUPRIFLE_MK2]: {
        recoil: 0.5,
        ammo: 'ammo_05',
    },
    [WeaponName.MILITARYRIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_07',
    },
    [WeaponName.HEAVYRIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_07',
        drawPosition: { model: GetHashKey('w_ar_heavyrifleh'), ...DrawPositions['AR'] },
    },
    [WeaponName.TACTICALRIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_06',
        drawPosition: { model: GetHashKey('w_ar_carbinerifle_reh'), ...DrawPositions['AR'] },
    },

    // Shotguns
    [WeaponName.PUMPSHOTGUN]: {
        recoil: 0.5,
        ammo: 'ammo_08',
        drawPosition: { model: GetHashKey('w_sg_pumpshotgun'), ...DrawPositions['LMG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_PUMPSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_SR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Skin', component: 'COMPONENT_PUMPSHOTGUN_VARMOD_LOWRIDER', type: WeaponComponentType.Skin },
            { label: 'Skin secu', component: 'COMPONENT_PUMPSHOTGUN_VARMOD_SECURITY', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.SAWNOFFSHOTGUN]: {
        recoil: 0.5,
        ammo: 'ammo_08',
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_SAWNOFFSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Skin', component: 'COMPONENT_SAWNOFFSHOTGUN_VARMOD_LUXE', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.ASSAULTSHOTGUN]: {
        recoil: 0.5,
        ammo: 'ammo_08',
        drawPosition: { model: GetHashKey('w_sg_assaultshotgun'), ...DrawPositions['LMG'] },
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
        ammo: 'ammo_08',
        drawPosition: { model: GetHashKey('w_sg_bullpupshotgun'), ...DrawPositions['LMG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_BULLPUPSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.MUSKET]: {
        recoil: 0.5,
        ammo: 'ammo_09',
        drawPosition: { model: GetHashKey('w_ar_musket'), ...DrawPositions['LMG'] },
    },
    [WeaponName.HEAVYSHOTGUN]: {
        recoil: 0.5,
        ammo: 'ammo_08',
        drawPosition: { model: GetHashKey('w_sg_heavyshotgun'), ...DrawPositions['LMG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_HEAVYSHOTGUN_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_HEAVYSHOTGUN_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Drum Magazine', component: 'COMPONENT_HEAVYSHOTGUN_CLIP_03', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP_02', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.DBSHOTGUN]: {
        recoil: 0.5,
        ammo: 'ammo_08',
    },
    [WeaponName.AUTOSHOTGUN]: {
        recoil: 0.5,
        ammo: 'ammo_08',
    },
    [WeaponName.PUMPSHOTGUN_MK2]: {
        recoil: 0.5,
        ammo: 'ammo_08',
        drawPosition: { model: GetHashKey('w_sg_pumpshotgunmk2'), ...DrawPositions['LMG'] },
    },
    [WeaponName.COMBATSHOTGUN]: {
        recoil: 0.5,
        ammo: 'ammo_08',
        drawPosition: { model: GetHashKey('w_sg_pumpshotgunh4'), ...DrawPositions['LMG'] },
        attachments: [
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
        ],
    },

    // Machine Guns
    [WeaponName.MG]: {
        recoil: 0.5,
        ammo: 'ammo_10',
        drawPosition: { model: GetHashKey('w_mg_mg'), ...DrawPositions['LMG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MG_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL_02', type: WeaponComponentType.Scope },
            { label: 'Skin', component: 'COMPONENT_MG_VARMOD_LOWRIDER', type: WeaponComponentType.Skin },
        ],
    },
    [WeaponName.COMBATMG]: {
        recoil: 0.5,
        ammo: 'ammo_10',
        drawPosition: { model: GetHashKey('w_mg_combatmg'), ...DrawPositions['LMG'] },
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
        ammo: 'ammo_10',
        drawPosition: { model: GetHashKey('w_sb_gusenberg'), ...DrawPositions['LMG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_GUSENBERG_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_GUSENBERG_CLIP_02', type: WeaponComponentType.Clip },
        ],
    },
    [WeaponName.COMBATMG_MK2]: {
        recoil: 0.5,
        ammo: 'ammo_10',
        drawPosition: { model: GetHashKey('w_mg_combatmgmk2'), ...DrawPositions['LMG'] },
    },

    // Heavy Weapons
    [WeaponName.RPG]: {
        recoil: 0.5,
        ammo: 'ammo_11',
        drawPosition: { model: GetHashKey('w_lr_rpg'), ...DrawPositions['RPG'] },
        attachments: [{ label: 'Default Clip', component: 'COMPONENT_RPG_CLIP_01', type: WeaponComponentType.Clip }],
    },
    [WeaponName.GRENADELAUNCHER]: {
        recoil: 0.5,
        ammo: 'ammo_12',
        drawPosition: { model: GetHashKey('w_lr_grenadelauncher'), ...DrawPositions['RPG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_GRENADELAUNCHER_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_SMALL', type: WeaponComponentType.Scope },
        ],
    },
    [WeaponName.GRENADELAUNCHER_SMOKE]: {
        recoil: 0.5,
        ammo: 'ammo_12',
        drawPosition: { model: GetHashKey('w_lr_grenadelauncher'), ...DrawPositions['RPG'] },
    },
    [WeaponName.MINIGUN]: {
        recoil: 0.5,
        ammo: 'ammo_10',
        drawPosition: { model: GetHashKey('w_mg_minigun'), ...DrawPositions['RPG'] },
    },
    [WeaponName.FIREWORK]: {
        recoil: 0.5,
        ammo: 'ammo_13',
        drawPosition: { model: GetHashKey('w_lr_firework'), ...DrawPositions['RPG'] },
    },
    [WeaponName.RAILGUN]: {
        recoil: 0.5,
        ammo: 'ammo_14',
        drawPosition: { model: GetHashKey('w_ar_railgun'), ...DrawPositions['RPG'] },
    },
    [WeaponName.HOMINGLAUNCHER]: {
        recoil: 0.5,
        ammo: 'ammo_15',
        drawPosition: { model: GetHashKey('w_lr_homing'), ...DrawPositions['RPG'] },
    },
    [WeaponName.COMPACTLAUNCHER]: {
        recoil: 0.5,
        ammo: 'ammo_12',
    },
    [WeaponName.RAYMINIGUN]: {
        recoil: 0.5,
        ammo: 'ammo_14',
        drawPosition: { model: GetHashKey('w_mg_sminigun'), ...DrawPositions['RPG'] },
    },
    [WeaponName.EMPLAUNCHER]: {
        recoil: 0.5,
        ammo: 'ammo_14',
    },

    // Sniper
    [WeaponName.SNIPERRIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_16',
        drawPosition: { model: GetHashKey('w_sr_sniperrifle'), ...DrawPositions['RPG'] },
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
        ammo: 'ammo_16',
        drawPosition: { model: GetHashKey('w_sr_heavysniper'), ...DrawPositions['RPG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_HEAVYSNIPER_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_LARGE', type: WeaponComponentType.Scope },
            { label: 'Adv Scope', component: 'COMPONENT_AT_SCOPE_MAX', type: WeaponComponentType.Scope },
        ],
    },
    [WeaponName.HEAVYSNIPER_MK2]: {
        recoil: 0.5,
        ammo: 'ammo_16',
        drawPosition: { model: GetHashKey('w_sr_heavysnipermk2'), ...DrawPositions['RPG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_HEAVYSNIPER_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_LARGE', type: WeaponComponentType.Scope },
            { label: 'Adv Scope', component: 'COMPONENT_AT_SCOPE_MAX', type: WeaponComponentType.Scope },
        ],
    },
    [WeaponName.MARKSMANRIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_07',
        drawPosition: { model: GetHashKey('w_sr_marksmanrifle'), ...DrawPositions['RPG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MARKSMANRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MARKSMANRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_LARGE_FIXED_ZOOM', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.MARKSMANRIFLE_MK2]: {
        recoil: 0.5,
        ammo: 'ammo_07',
        drawPosition: { model: GetHashKey('w_sr_marksmanriflemk2'), ...DrawPositions['RPG'] },
        attachments: [
            { label: 'Default Clip', component: 'COMPONENT_MARKSMANRIFLE_CLIP_01', type: WeaponComponentType.Clip },
            { label: 'Extended Clip', component: 'COMPONENT_MARKSMANRIFLE_CLIP_02', type: WeaponComponentType.Clip },
            { label: 'Flashlight', component: 'COMPONENT_AT_AR_FLSH', type: WeaponComponentType.Flashlight },
            { label: 'Scope', component: 'COMPONENT_AT_SCOPE_LARGE_FIXED_ZOOM', type: WeaponComponentType.Scope },
            { label: 'Suppressor', component: 'COMPONENT_AT_AR_SUPP', type: WeaponComponentType.Suppressor },
            { label: 'Grip', component: 'COMPONENT_AT_AR_AFGRIP', type: WeaponComponentType.Grip },
        ],
    },
    [WeaponName.PRECISIONRIFLE]: {
        recoil: 0.5,
        ammo: 'ammo_16',
        drawPosition: { model: GetHashKey('w_sr_precisionrifle_reh'), ...DrawPositions['RPG'] },
    },

    // Launcher
    [WeaponName.GRENADE]: { attachments: [] },
    [WeaponName.BZGAS]: { attachments: [] },
    [WeaponName.MOLOTOV]: { attachments: [] },
    [WeaponName.STICKYBOMB]: { attachments: [] },
    [WeaponName.PROXMINE]: { attachments: [] },
    [WeaponName.SNOWBALL]: { attachments: [] },
    [WeaponName.PIPEBOMB]: { attachments: [] },
    [WeaponName.BALL]: { attachments: [] },
    [WeaponName.SMOKEGRENADE]: { attachments: [] },
    [WeaponName.FLARE]: { attachments: [] },

    // Other
    [WeaponName.PETROLCAN]: { attachments: [] },
    [WeaponName.FIREEXTINGUISHER]: { attachments: [] },
    [WeaponName.HAZARDCAN]: { attachments: [] },
};

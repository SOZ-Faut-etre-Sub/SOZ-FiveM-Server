import { DBSearch } from '@private/shared/business.cyber';
import { DrugContractInfo } from '@private/shared/drugs';
import { MissiveType } from '@private/shared/missive';
import { Item, ItemType } from '@public/shared/item';
import { joaat } from '@public/shared/joaat';
import { DamageServerData } from '@public/shared/job/lsmc';
import { CardType } from '@public/shared/nui/card';
import { FakeId, PlayerCharInfo, PlayerJob, PlayerMetadata } from '@public/shared/player';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector3 } from '@public/shared/polyzone/vector';
import { deepEqual } from '@public/shared/util';
import { VehicleClass } from '@public/shared/vehicle/vehicle';
import { WeaponComponentType } from '@public/shared/weapons/attachment';
import { WeaponMk2TintColor, WeaponTintColor } from '@public/shared/weapons/tint';

export enum InventoryType {
    Ammo = 'ammo',
    Armory = 'armory',
    Bin = 'bin',
    BossStorage = 'boss_storage',
    CabinetStorage = 'cabinet_storage',
    Cloakroom = 'cloakroom',
    Distillery = 'distillery',
    EvidenceStorage = 'evidence_storage',
    FlavorStorage = 'flavor_storage',
    Fridge = 'fridge',
    FurnitureStorage = 'furniture_storage',
    GangStash = 'gang_stash',
    IceMachine = 'ice_machine',
    Inverter = 'inverter',
    HouseFridge = 'house_fridge',
    HouseStash = 'house_stash',
    LiquorStorage = 'liquor_storage',
    LogProcessing = 'log_processing',
    LogStorage = 'log_storage',
    LsCustomStorage = 'ls_custom_storage',
    MetalConverter = 'metal_converter',
    MetalIncinerator = 'metal_incinerator',
    MetalStorage = 'metal_storage',
    ObjectStorage = 'object_storage',
    Organ = 'organ',
    Player = 'player',
    PlankStorage = 'plank_storage',
    RecyclerProcessing = 'recycler_processing',
    SawdustStorage = 'sawdust_storage',
    Seizure = 'seizure',
    SnackStorage = 'snack_storage',
    SmugglingBlackMarket = 'smuggling_blackmarket',
    SmugglingBox = 'smuggling_box',
    SmugglingConnected = 'smuggling_connected',
    SmugglingExport = 'smuggling_export',
    SmugglingOre = 'smuggling_ore',
    SmugglingElectronic = 'smuggling_electronic',
    SmugglingConvoyExport = 'smuggling_convoy_export',
    Stash = 'stash',
    Storage = 'storage',
    StorageTank = 'storage_tank',
    Trunk = 'trunk',
}

export type AddError =
    | 'item_not_found'
    | 'not_enough_space'
    | 'already_exists'
    | 'invalid_slot'
    | 'invalid_amount'
    | 'not_allowed';

export type MergeError =
    | 'item_not_found'
    | 'not_enough_space'
    | 'no_item_to_merge'
    | 'cannot_merge'
    | 'scientist_photo_expired'
    | 'max_plates_reached'
    | 'add_plates_on_stack';

export const ADD_ERROR_MESSAGE: Record<AddError, string> = {
    item_not_found: "L'objet n'a pas été trouvé !",
    not_enough_space: "L'inventaire n'a plus de place !",
    already_exists: 'Vous avez déjà un tel object sur vous !',
    invalid_slot: "La place indiquée n'est pas valide",
    invalid_amount: 'La quantité à transférer est invalide !',
    not_allowed: 'Vous ne pouvez pas stocker cet objet ici !',
};

export const MERGE_ERROR_MESSAGE: Record<MergeError, string> = {
    item_not_found: "L'objet n'a pas été trouvé !",
    not_enough_space: "L'inventaire n'a plus de place !",
    no_item_to_merge: 'Aucun objet à fusionner !',
    cannot_merge: 'Vous ne pouvez pas fusionner ces objets !',
    scientist_photo_expired: "Cette preuve est périmée, elle n'est plus utilisable.",
    max_plates_reached: "Impossible d'attacher plus de ~b~plaques balistiques~s~ à ce ~b~gilet~s~.",
    add_plates_on_stack: "Impossible d'attacher une ~b~plaque balistique~s~ à une ~b~pile de gilets.~s~",
};

export type InventoryConfiguration = {
    maxWeight: number;
    persistent: boolean;
    allowedItemTypes?: ItemType[];
    allowedItems?: string[];
    notAllowedItems?: string[];
    notAllowedItemTypes?: ItemType[];
    owner?: string;
    parentInventoryId?: string;
    requiredMetadata?: keyof InventoryItemMetadata;
};

export type Inventory = {
    id: string;
    items: Record<number, InventoryItem>;
    configuration: InventoryConfiguration;
};

export const DEFAULT_INVENTORY_CONFIGURATION: InventoryConfiguration = {
    maxWeight: 25_000,
    persistent: true,
};

export const HOUSE_STORAGE_TIER_WEIGHTS = {
    [-2]: 1000000000,
    0: 200000,
    1: 400000,
    2: 600000,
    3: 800000,
    4: 1000000,
    5: 1400000,
    6: 1800000,
    7: 2000000,
    8: 3000000,
    9: 4000000,
};
export const HOUSE_FRIDGE_TIER_WEIGHTS = {
    [-2]: 1000000000,
    0: 200000,
    1: 400000,
    2: 600000,
    3: 800000,
    4: 1000000,
    5: 1400000,
    6: 1800000,
    7: 2000000,
    8: 3000000,
    9: 4000000,
};

export const INVENTORY_CONFIGURATIONS: Partial<Record<InventoryType, Partial<InventoryConfiguration>>> = {
    [InventoryType.Player]: {
        maxWeight: 25000,
    },
    [InventoryType.Ammo]: {
        maxWeight: 10000000,
        allowedItemTypes: ['weapon_ammo'],
    },
    [InventoryType.Armory]: {
        maxWeight: 10000000,
        allowedItemTypes: ['weapon', 'tool'],
    },
    [InventoryType.Fridge]: {
        maxWeight: 10000000,
        allowedItemTypes: ['food', 'drink', 'cocktail', 'liquor', 'crate', 'drug'],
        allowedItems: ['mushroom'],
    },
    [InventoryType.Trunk]: {
        allowedItemTypes: [
            'weapon',
            'weapon_ammo',
            'item',
            'evidence',
            'fishing_rod',
            'fishing_garbage',
            'fishing_bait',
            'fish',
            'drug',
            'drink',
            'cocktail',
            'food',
            'oil_and_item',
            'plank',
            'sawdust',
            'item_illegal',
            'liquor',
            'furniture',
            'flavor',
            'outfit',
            'crate',
            'drug_pot',
            'tool',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.Storage]: {
        maxWeight: 10000000,
        allowedItems: ['weapon_uvflashlight'],
        allowedItemTypes: ['item', 'oil_and_item', 'outfit', 'crate', 'drug_pot', 'evidence'],
    },
    [InventoryType.EvidenceStorage]: {
        maxWeight: 10000000,
        allowedItems: ['detective_board'],
        allowedItemTypes: ['evidence'],
    },
    [InventoryType.StorageTank]: {
        maxWeight: 10000000,
        allowedItemTypes: ['oil', 'oil_and_item'],
    },
    [InventoryType.Seizure]: {
        maxWeight: 2000000,
        allowedItemTypes: [
            'weapon',
            'weapon_ammo',
            'drug',
            'item',
            'item_illegal',
            'drug_pot',
            'tool',
            'evidence',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.ObjectStorage]: {
        maxWeight: 10000000,
        allowedItemTypes: [
            'item',
            'fishing_rod',
            'fishing_garbage',
            'fishing_bait',
            'fish',
            'drug',
            'food',
            'drink',
            'cocktail',
            'item_illegal',
            'organ',
            'oil',
            'oil_and_item',
            'log',
            'sawdust',
            'plank',
            'flavor',
            'furniture',
            'liquor',
            'outfit',
            'crate',
            'drug_pot',
            'tool',
            'energy',
            'metal',
            'weapon',
            'weapon_ammo',
            'evidence',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.BossStorage]: {
        maxWeight: 10000000,
        allowedItemTypes: ['weapon', 'weapon_ammo', 'item', 'oil_and_item', 'tool', 'evidence'],
    },
    [InventoryType.Cloakroom]: {
        maxWeight: 1000000,
        allowedItemTypes: ['outfit'],
    },
    [InventoryType.Organ]: {
        maxWeight: 10000000,
        allowedItemTypes: ['organ'],
    },
    [InventoryType.Stash]: {
        allowedItemTypes: ['item', 'evidence'],
    },
    [InventoryType.Bin]: {
        persistent: false,
        maxWeight: 25000,
        allowedItemTypes: [
            'item',
            'evidence',
            'fishing_rod',
            'fishing_garbage',
            'fishing_bait',
            'fish',
            'drug',
            'food',
            'drink',
            'cocktail',
            'item_illegal',
            'organ',
            'oil',
            'oil_and_item',
            'log',
            'sawdust',
            'plank',
            'flavor',
            'furniture',
            'liquor',
            'outfit',
            'crate',
            'drug_pot',
            'tool',
            'metal',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.HouseFridge]: {
        maxWeight: HOUSE_FRIDGE_TIER_WEIGHTS[0],
        allowedItemTypes: ['food', 'drink', 'cocktail', 'liquor', 'flavor', 'crate', 'drug'],
    },
    [InventoryType.HouseStash]: {
        maxWeight: HOUSE_STORAGE_TIER_WEIGHTS[0],
        allowedItemTypes: [
            'item',
            'item_illegal',
            'weapon',
            'weapon_ammo',
            'furniture',
            'outfit',
            'log',
            'oil_and_item',
            'plank',
            'sawdust',
            'fishing_rod',
            'fishing_garbage',
            'fishing_bait',
            'fish',
            'drug_pot',
            'tool',
            'evidence',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.LogStorage]: {
        maxWeight: 40000000,
        allowedItemTypes: ['log'],
    },
    [InventoryType.PlankStorage]: {
        maxWeight: 2000000,
        allowedItemTypes: ['plank'],
    },
    [InventoryType.SawdustStorage]: {
        maxWeight: 2000000,
        allowedItemTypes: ['sawdust'],
    },
    [InventoryType.LogProcessing]: {
        maxWeight: 400000,
        allowedItemTypes: ['log'],
    },
    [InventoryType.CabinetStorage]: {
        maxWeight: 24000000,
        allowedItemTypes: ['item'],
    },
    [InventoryType.Inverter]: {
        maxWeight: 2000000,
        allowedItemTypes: ['energy'],
    },
    [InventoryType.LiquorStorage]: {
        maxWeight: 600000,
        allowedItemTypes: ['liquor'],
    },
    [InventoryType.FlavorStorage]: {
        maxWeight: 400000,
        allowedItemTypes: ['flavor'],
    },
    [InventoryType.FurnitureStorage]: {
        maxWeight: 200000,
        allowedItemTypes: ['furniture'],
    },
    [InventoryType.SnackStorage]: {
        maxWeight: 200000,
        allowedItemTypes: ['food'],
    },
    [InventoryType.SmugglingBox]: {
        persistent: false,
        maxWeight: 250000,
        allowedItemTypes: [
            'item',
            'fishing_rod',
            'fishing_garbage',
            'fishing_bait',
            'fish',
            'drug',
            'food',
            'drink',
            'cocktail',
            'item_illegal',
            'organ',
            'oil',
            'oil_and_item',
            'log',
            'sawdust',
            'plank',
            'flavor',
            'furniture',
            'liquor',
            'outfit',
            'crate',
            'drug_pot',
            'tool',
            'energy',
            'metal',
            'weapon',
            'weapon_ammo',
            'evidence',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.MetalConverter]: {
        maxWeight: 500000,
        allowedItemTypes: ['metal'],
    },
    [InventoryType.MetalIncinerator]: {
        maxWeight: 500000,
        allowedItemTypes: ['metal', 'weapon', 'weapon_ammo'],
    },
    [InventoryType.MetalStorage]: {
        maxWeight: 10000000,
        allowedItemTypes: ['item', 'oil_and_item', 'outfit', 'crate', 'drug_pot', 'metal'],
    },
    [InventoryType.LsCustomStorage]: {
        maxWeight: 800000,
        allowedItemTypes: ['item'],
    },
    [InventoryType.RecyclerProcessing]: {
        maxWeight: 800000,
        allowedItemTypes: [
            'item',
            'drug',
            'food',
            'drink',
            'cocktail',
            'item_illegal',
            'organ',
            'oil',
            'oil_and_item',
            'log',
            'sawdust',
            'plank',
            'flavor',
            'furniture',
            'liquor',
            'crate',
            'fish',
            'fishing_rod',
            'fishing_garbage',
            'fishing_bait',
            'evidence',
            'drug_pot',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.SmugglingExport]: {
        maxWeight: 5000000,
        persistent: false,
        allowedItemTypes: ['smuggling_export'],
    },
    [InventoryType.Distillery]: {
        maxWeight: 48000,
        allowedItems: ['smuggling_flower_zoublon'],
        allowedItemTypes: [],
    },
    [InventoryType.GangStash]: {
        allowedItemTypes: [
            'item',
            'item_illegal',
            'weapon',
            'weapon_ammo',
            'furniture',
            'outfit',
            'log',
            'oil_and_item',
            'plank',
            'sawdust',
            'fishing_rod',
            'fishing_garbage',
            'fishing_bait',
            'fish',
            'drug',
            'food',
            'drink',
            'cocktail',
            'organ',
            'oil',
            'flavor',
            'liquor',
            'crate',
            'drug_pot',
            'tool',
            'energy',
            'metal',
            'evidence',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.SmugglingConnected]: {
        maxWeight: 500000,
        allowedItemTypes: [
            'item',
            'fishing_rod',
            'fishing_garbage',
            'fishing_bait',
            'fish',
            'drug',
            'food',
            'drink',
            'cocktail',
            'item_illegal',
            'organ',
            'oil',
            'oil_and_item',
            'log',
            'sawdust',
            'plank',
            'flavor',
            'furniture',
            'liquor',
            'outfit',
            'crate',
            'drug_pot',
            'tool',
            'energy',
            'metal',
            'weapon',
            'weapon_ammo',
            'evidence',
            'veh_biz_piece',
            'smuggling_export',
            'smuggling_convoy_export',
            'smuggling_ore',
            'smuggling_electronic',
        ],
    },
    [InventoryType.SmugglingBlackMarket]: {
        maxWeight: 200_000,
    },
};

export type InventoryItem = {
    name: string;
    slot: number;
    type: ItemType;
    amount: number;
    metadata: InventoryItemMetadata;
};

export type MealMetadata = {
    name: string;
    metadata: InventoryItemMetadata;
    amount: number;
    label: string;
};

export type EvidenceMetadata = {
    type: string;
    generalInfo: string;
    quantity?: number;
    zone?: string;
    support?: string;
    isAnalyzed?: boolean;
    dateAnalyzed?: string;
};

export type MedicalMetadata = {
    damages: DamageServerData[];
    patient: {
        charinfo: PlayerCharInfo;
        job: PlayerJob;
        metadata: PlayerMetadata;
        hash: number;
    };
    date: number;
};

export type ZkeaFournitureMetadata = {
    type: string;
    name: string;
    model: string;
};

export type InventoryItemMetadata = {
    label?: string;
    type?: string;
    expiration?: string;
    creation?: string;
    player?: number;
    // Weapom
    serial?: string;
    health?: number;
    maxHealth?: number;
    ammo?: number;
    tint?: WeaponTintColor | WeaponMk2TintColor;
    missiveType?: MissiveType;
    missiveChoice1?: number;
    missiveChoice2?: number;
    missiveChoice3?: number;
    attachments?: Record<WeaponComponentType, string | null>;
    tier?: number;
    crafted?: boolean;
    id?: string;
    model?: string;
    crateElements?: MealMetadata[];
    zkeaCrateElements?: ZkeaFournitureMetadata[];
    // Fishing
    weight?: number;
    length?: number;
    bait?: Omit<InventoryItem, 'slot'>;
    fuel?: number;
    drugContract?: DrugContractInfo;
    fakeIdData?: FakeId;
    // Weapon certificate (DMC)
    craftCertificate?: string;
    serializedDetectiveBoard?: any;
    originalDetectiveBoard?: boolean;
    photosInDetectiveBoard?: string[];
    photoUrl?: string;
    evidenceInfos?: EvidenceMetadata;
    storageElements?: InventoryItem[] | Record<number, InventoryItem>;
    plates?: number;
    iban?: string;
    keyid?: string;
    printed?: boolean;
    value?: number;
    notSearchable?: boolean;
    cyberDBSearch?: DBSearch;
};

export const isInventoryItemExpired = (item: InventoryItem): boolean => {
    if (item.metadata && item.metadata.expiration) {
        return new Date().getTime() > new Date(item.metadata.expiration).getTime();
    }

    return false;
};

export const VEHICLE_CONFIGURATION_BY_VEHICLE_CLASS: Record<VehicleClass, Partial<InventoryConfiguration>> = {
    [VehicleClass.Compacts]: { maxWeight: 20000 },
    [VehicleClass.Sedans]: { maxWeight: 60000 },
    [VehicleClass.SUVs]: { maxWeight: 80000 },
    [VehicleClass.Coupes]: { maxWeight: 40000 },
    [VehicleClass.Muscle]: { maxWeight: 30000 },
    [VehicleClass.SportsClassics]: { maxWeight: 20000 },
    [VehicleClass.Sports]: { maxWeight: 20000 },
    [VehicleClass.Super]: { maxWeight: 20000 },
    [VehicleClass.Motorcycles]: { maxWeight: 40000 },
    [VehicleClass.OffRoad]: { maxWeight: 100000 },
    [VehicleClass.Industrial]: { maxWeight: 0 },
    [VehicleClass.Utility]: { maxWeight: 0 },
    [VehicleClass.Vans]: { maxWeight: 200000 },
    [VehicleClass.Cycles]: { maxWeight: 2000 },
    [VehicleClass.Boats]: { maxWeight: 100000 },
    [VehicleClass.Helicopters]: { maxWeight: 100000 },
    [VehicleClass.Planes]: { maxWeight: 0 },
    [VehicleClass.Service]: { maxWeight: 0 },
    [VehicleClass.Emergency]: { maxWeight: 0 },
    [VehicleClass.Military]: { maxWeight: 0 },
    [VehicleClass.Commercial]: { maxWeight: 0 },
    [VehicleClass.Trains]: { maxWeight: 0 },
    [VehicleClass.OpenWheel]: { maxWeight: 20000 },
};

const TANKER_ITEM_TYPES: ItemType[] = ['oil', 'oil_and_item'];
const BRICKADE_ITEM_TYPES: ItemType[] = ['energy'];
const TRAILER_LOGS_ITEM_TYPES: ItemType[] = ['log'];
const TIP_TRUCK_ITEM_TYPES: ItemType[] = ['metal'];
const TRASH_ITEM_TYPES: ItemType[] = [
    'item',
    'evidence',
    'fishing_rod',
    'fishing_garbage',
    'fishing_bait',
    'fish',
    'drug',
    'food',
    'drink',
    'cocktail',
    'item_illegal',
    'organ',
    'oil',
    'oil_and_item',
    'log',
    'sawdust',
    'plank',
    'flavor',
    'furniture',
    'liquor',
    'outfit',
    'crate',
    'drug_pot',
];

export const VEHICLE_CONFIGURATION_BY_VEHICLE_MODEL: Record<number, Partial<InventoryConfiguration>> = {
    // Vans
    [joaat('moonbeam')]: { maxWeight: 200000 },
    [joaat('moonbeam2')]: { maxWeight: 200000 },

    // policeold
    [joaat('policeold1')]: { maxWeight: 80000 },
    [joaat('policeold2')]: { maxWeight: 80000 },

    // policenew
    [joaat('polimpaler6')]: { maxWeight: 80000 },
    [joaat('poldominator10')]: { maxWeight: 80000 },
    [joaat('polimpaler5')]: { maxWeight: 80000 },
    [joaat('polgreenwood')]: { maxWeight: 80000 },
    [joaat('poldorado')]: { maxWeight: 80000 },

    // LSPD
    [joaat('police')]: { maxWeight: 60000 },
    [joaat('police2')]: { maxWeight: 60000 },
    [joaat('police3')]: { maxWeight: 60000 },
    [joaat('police4')]: { maxWeight: 60000 },
    [joaat('police5')]: { maxWeight: 80000 },
    [joaat('lspd10')]: { maxWeight: 80000 },
    [joaat('lspd11')]: { maxWeight: 80000 },
    [joaat('lspd12')]: { maxWeight: 80000 },
    [joaat('lspd20')]: { maxWeight: 80000 },
    [joaat('lspd21')]: { maxWeight: 80000 },
    [joaat('lspd30')]: { maxWeight: 30000 },
    [joaat('lspd40')]: { maxWeight: 40000 },
    [joaat('lspd41')]: { maxWeight: 40000 },
    [joaat('lspd50')]: { maxWeight: 80000 },
    [joaat('lspd51')]: { maxWeight: 80000 },
    [joaat('lspd60')]: { maxWeight: 500000 },
    [joaat('polmav')]: { maxWeight: 200000 },
    [joaat('policet')]: { maxWeight: 500000 },
    [joaat('riot')]: { maxWeight: 500000 },

    // BCSO
    [joaat('sheriff')]: { maxWeight: 60000 },
    [joaat('sheriff2')]: { maxWeight: 100000 },
    [joaat('sheriffb')]: { maxWeight: 30000 },
    [joaat('bcso10')]: { maxWeight: 60000 },
    [joaat('bcso11')]: { maxWeight: 60000 },
    [joaat('bcso12')]: { maxWeight: 60000 },
    [joaat('bcso20')]: { maxWeight: 100000 },
    [joaat('bcso21')]: { maxWeight: 100000 },
    [joaat('bcso30')]: { maxWeight: 30000 },
    [joaat('bcso40')]: { maxWeight: 40000 },
    [joaat('bcso41')]: { maxWeight: 40000 },
    [joaat('bcso50')]: { maxWeight: 80000 },
    [joaat('bcso51')]: { maxWeight: 80000 },
    [joaat('bcso60')]: { maxWeight: 500000 },
    [joaat('maverick2')]: { maxWeight: 200000 },

    // LSMC
    [joaat('ambulance')]: { maxWeight: 100000 },
    [joaat('ambulance2')]: { maxWeight: 100000 },
    [joaat('ambcar')]: { maxWeight: 80000 },
    [joaat('lguard')]: { maxWeight: 80000 },
    [joaat('firetruk')]: { maxWeight: 80000 },
    [joaat('polmav')]: { maxWeight: 200000 },

    // STONKS
    [joaat('stockade')]: { maxWeight: 1000000 },
    [joaat('baller9')]: { maxWeight: 80000 },

    // Twitch News
    [joaat('newsvan')]: { maxWeight: 100000 },
    [joaat('frogger3')]: { maxWeight: 200000 },

    // Chateau Marius
    [joaat('mule6')]: { maxWeight: 400000 },
    [joaat('taco1')]: { maxWeight: 100000 },

    // Michel Transport Petrol
    [joaat('packer2')]: { maxWeight: 40000 },
    [joaat('tanker')]: { maxWeight: 825000, allowedItemTypes: TANKER_ITEM_TYPES },
    [joaat('tanker2')]: { maxWeight: 825000, allowedItemTypes: TANKER_ITEM_TYPES },
    [joaat('utillitruck4')]: { maxWeight: 100000 },

    // CarlJr Services
    [joaat('dynasty2')]: { maxWeight: 40000 },

    // Benny's
    [joaat('flatbed3')]: { maxWeight: 40000 },
    [joaat('burito6')]: { maxWeight: 100000 },

    // BlueBird
    [joaat('trash')]: { maxWeight: 400000, allowedItemTypes: TRASH_ITEM_TYPES },

    // Pole Emploi
    [joaat('scrap')]: { maxWeight: 100000 },
    [joaat('faggio4')]: { maxWeight: 20000 },
    [joaat('fixter')]: { maxWeight: 5000 },

    // Pawl
    [joaat('hauler1')]: { maxWeight: 40000 },
    [joaat('sadler1')]: { maxWeight: 200000 },
    [joaat('trailerlogs')]: { maxWeight: 400000, allowedItemTypes: TRAILER_LOGS_ITEM_TYPES },

    // UPW
    [joaat('boxville')]: { maxWeight: 50000 },
    [joaat('brickade')]: { maxWeight: 100000, allowedItemTypes: BRICKADE_ITEM_TYPES },
    [joaat('brickade1')]: { maxWeight: 100000, allowedItemTypes: BRICKADE_ITEM_TYPES },

    // BAUN
    [joaat('youga3')]: { maxWeight: 200000 },

    // FBI
    [joaat('polgauntlet')]: { maxWeight: 80000 },
    [joaat('fbi2')]: { maxWeight: 200000 },
    [joaat('paragonsfbi')]: { maxWeight: 80000 },

    // FFS
    [joaat('rumpo4')]: { maxWeight: 200000 },

    // DMC
    [joaat('tiptruck2')]: { maxWeight: 200000, allowedItemTypes: TIP_TRUCK_ITEM_TYPES },
    [joaat('rubble')]: { maxWeight: 200000 },

    // Army
    [joaat('barracks')]: { maxWeight: 1000000 },
    [joaat('dinghy5')]: { maxWeight: 200000 },

    // Quads
    [joaat('blazer')]: { maxWeight: 20000 },
    [joaat('blazer3')]: { maxWeight: 20000 },
    [joaat('blazer4')]: { maxWeight: 20000 },

    // Boats
    [joaat('seashark')]: { maxWeight: 20000 },
    [joaat('suntrap')]: { maxWeight: 40000 },
    [joaat('tropic')]: { maxWeight: 40000 },
    [joaat('tropic2')]: { maxWeight: 40000 },
    [joaat('tropic3')]: { maxWeight: 40000 },
    [joaat('dinghy')]: { maxWeight: 40000 },
    [joaat('squalo')]: { maxWeight: 80000 },
    [joaat('jetmax')]: { maxWeight: 80000 },
    [joaat('speeder')]: { maxWeight: 80000 },
    [joaat('speeder2')]: { maxWeight: 80000 },

    // FDF
    [joaat('benson')]: {
        maxWeight: 400000,
        allowedItems: ['potato_seed', 'tomato_seed', 'corn_seed', 'cabage_seed', 'pumpkin_seed', 'lunchbox'],
        allowedItemTypes: ['food', 'drink', 'liquor'],
    },
    [joaat('tractor2')]: { maxWeight: 20000 },
    [joaat('graintrailer')]: { maxWeight: 100000 },

    // ZKEA
    [joaat('mule3')]: { maxWeight: 210000, allowedItems: ['zkea_crate'], allowedItemTypes: [] },

    // Other
    [joaat('vagrant')]: { maxWeight: 10000 },

    // Cartel
    [joaat('streamer216')]: { maxWeight: 500000 },
    [joaat('dodo')]: { maxWeight: 200000 },
    [joaat('microlight')]: { maxWeight: 50000 },
    [joaat('pony')]: { maxWeight: 250000 },
    [joaat('pony2')]: { maxWeight: 250000 },
    [joaat('brutus')]: { maxWeight: 300000 },
    [joaat('rumpo3')]: { maxWeight: 350000 },

    // Trains
    [joaat('freightcar')]: { maxWeight: 200000 },
    [joaat('freightcar2')]: { maxWeight: 200000 },
    [joaat('freightcont1')]: { maxWeight: 200000 },
    [joaat('freightcont2')]: { maxWeight: 200000 },
    [joaat('freightgrain')]: { maxWeight: 200000 },
    [joaat('tankercar')]: { maxWeight: 200000 },

    // Other
    [joaat('zrtblizzard')]: { maxWeight: 40000 },

    // Vehicule trailer
    [joaat('tr4')]: { maxWeight: 1000000 },
};

/**
 *
 *         [-2] = {slot = 10, weight = 1000000000}, -- for GM House
 *         [0] = {slot = 10, weight = 200000},
 *         [1] = {slot = 10, weight = 400000},
 *         [2] = {slot = 10, weight = 600000},
 *         [3] = {slot = 10, weight = 800000},
 *         [4] = {slot = 10, weight = 1000000},
 */

export const isItemAllowed = (
    type: ItemType,
    name: string,
    metadata: InventoryItemMetadata,
    configuration: InventoryConfiguration
): boolean => {
    let isAllowed = true;

    if (configuration.allowedItemTypes) {
        isAllowed = false;

        for (const allowedType of configuration.allowedItemTypes) {
            if (type === allowedType) {
                isAllowed = true;
                break;
            }
        }
    }

    if (configuration.notAllowedItemTypes) {
        for (const notAllowedType of configuration.notAllowedItemTypes) {
            if (type === notAllowedType) {
                isAllowed = false;
                break;
            }
        }
    }

    if (!isAllowed && configuration.allowedItems && configuration.allowedItems.includes(name)) {
        isAllowed = true;
    }

    if (isAllowed && configuration.notAllowedItems && configuration.notAllowedItems.includes(name)) {
        return false;
    }

    if (isAllowed && configuration.requiredMetadata && !metadata[configuration.requiredMetadata]) {
        return false;
    }

    return isAllowed;
};

export const getItemWeight = (
    id: string,
    amount = 1,
    itemResolver: (id: string) => Item | null,
    metadata?: InventoryItemMetadata | null
): number => {
    const item = itemResolver(id);

    if (!item) {
        return 0;
    }

    let baseWeight = metadata?.weight ?? item.weight;

    if (metadata?.crateElements) {
        baseWeight += getItemsWeight(metadata.crateElements, itemResolver);
    }

    if (metadata?.zkeaCrateElements) {
        baseWeight += metadata.zkeaCrateElements.length * ZKEA_CRATE_ITEM_WEIGHT;
    }

    if (metadata?.storageElements) {
        baseWeight += getItemsWeight(
            Object.values(metadata.storageElements).filter(item => item !== null),
            itemResolver
        );
    }

    return baseWeight * amount;
};

export const getItemsWeight = (
    items: { name: string; amount?: number; metadata?: InventoryItemMetadata }[],
    itemResolver: (id: string) => Item
): number => {
    let totalWeight = 0;

    for (const item of items) {
        totalWeight += getItemWeight(item.name, item.amount ?? 1, itemResolver, item.metadata);
    }

    return totalWeight;
};

export enum InventorySort {
    AlphabeticalAsc = 'alphabetical_asc',
    AlphabeticalDesc = 'alphabetical_desc',
    WeightAsc = 'weight_asc',
    WeightDesc = 'weight_desc',
    TypeAsc = 'type_asc',
    TypeDesc = 'type_desc',
}

export const INVENTORY_SORT_LABELS: Record<InventorySort, string> = {
    [InventorySort.AlphabeticalAsc]: 'Nom (A-Z)',
    [InventorySort.AlphabeticalDesc]: 'Nom (Z-A)',
    [InventorySort.WeightAsc]: 'Poids ↓',
    [InventorySort.WeightDesc]: 'Poids ↑',
    [InventorySort.TypeAsc]: 'Type (A-Z)',
    [InventorySort.TypeDesc]: 'Type (Z-A)',
};

type InventoryItemCompareItem = {
    name: string;
    metadata: InventoryItemMetadata;
};

export const isSameInventoryItem = (item1: InventoryItemCompareItem, item2: InventoryItemCompareItem): boolean => {
    if (item1.name !== item2.name) {
        return false;
    }

    const item1Metadata = item1.metadata || {};
    const item2Metadata = item2.metadata || {};

    return deepEqual(item1Metadata, item2Metadata);
};

export const GIFT_TYPE_ALLOWED: ItemType[] = [
    'item',
    'drug',
    'food',
    'drink',
    'cocktail',
    'flavor',
    'liquor',
    'fish',
    'fishing_garbage',
    'fishing_rod',
    'fishing_bait',
];

export const CRATE_TYPE_ALLOWED: ItemType[] = ['food', 'liquor', 'drink', 'cocktail'];

export const CRATE_MAX_WEIGHT = 12000;

export const ZKEA_CRATE_ITEM_WEIGHT = 2000;

export type InventoryCard = {
    type: CardType;
    label: string;
    description: string;
    iban?: string;
};

export type InventoryKey = VehicleKey | ApartmentKey;

export type VehicleKey = {
    type: 'vehicle';
    plate: string;
};

export type ApartmentKey = {
    type: 'apartment';
    label: string;
    propertyId: number;
    apartmentId: number;
};

export type InventoryItemCreator = {
    chance: number;
    min: number;
    max: number;
};

export const INVENTORY_ITEM_CREATORS: Partial<Record<InventoryType, Record<string, InventoryItemCreator>>> = {
    [InventoryType.Bin]: {
        metalscrap: {
            chance: 10,
            min: 0,
            max: 1,
        },
        aluminum: {
            chance: 10,
            min: 0,
            max: 2,
        },
        rubber: {
            chance: 10,
            min: 0,
            max: 2,
        },
        rolex: {
            chance: 5,
            min: 1,
            max: 1,
        },
        diamond_ring: {
            chance: 5,
            min: 1,
            max: 1,
        },
        goldchain: {
            chance: 5,
            min: 1,
            max: 1,
        },
        garbagebag: {
            chance: 100,
            min: 5,
            max: 20,
        },
    },
};

export type InventoryPosition = InventoryPositionFixed | InventoryPositionDynamic;

export const DEFAULT_MAX_INVENTORY_DISTANCE = 3;

export type InventoryPositionFixed = {
    type: 'fixed';
    position: Vector3;
    maxDistance?: number;
};

export type InventoryPositionDynamic = {
    type: 'dynamic';
    entity: number;
    dimension?: {
        min: Vector3;
        max: Vector3;
    };
    maxDistance?: number;
};

export const getPositionZone = (
    position: Vector3,
    heading: number,
    dimension: { min: Vector3; max: Vector3 },
    maxDistance: number
) => {
    const center = [
        position[0] + (dimension.max[0] + dimension.min[0]) / 2,
        position[1] + (dimension.max[1] + dimension.min[1]) / 2,
        position[2] + dimension.min[2],
    ] as Vector3;

    return new BoxZone(
        center,
        dimension.max[1] - dimension.min[1] + maxDistance,
        dimension.max[0] - dimension.min[0] + maxDistance,
        {
            heading,
            minZ: center[2],
            maxZ: center[2] + maxDistance * 2,
        }
    );
};

export type InventoryState = {
    canPutContent: boolean;
    canGetContent: boolean;
};

export const INVENTORY_DEFAULT_STATE: InventoryState = {
    canPutContent: true,
    canGetContent: true,
};

export const INVENTORY_STATES: Partial<Record<InventoryType, InventoryState>> = {
    [InventoryType.LogProcessing]: {
        canPutContent: true,
        canGetContent: false,
    },
    [InventoryType.MetalIncinerator]: {
        canPutContent: true,
        canGetContent: false,
    },
    [InventoryType.RecyclerProcessing]: {
        canPutContent: true,
        canGetContent: false,
    },
};

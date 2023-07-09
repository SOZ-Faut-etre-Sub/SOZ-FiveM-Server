import { SozRole } from '@core/permissions';
import { Talent } from '@private/shared/talent';

import { ClothConfig } from './cloth';
import { Disease, Organ } from './disease';
import { InventoryItem } from './item';
import { JobType } from './job';
import { Halloween2022 } from './story/halloween2022';

export type QBCorePlayer = {
    Functions: {
        SetMetaData: (key: string, val: any) => void;
        SetMetaDatas: (data: Record<string, any>) => void;
        UpdateMaxWeight: () => void;
        AddMoney: (type: 'money' | 'marked_money', amount: number) => boolean;
        RemoveMoney: (type: 'money' | 'marked_money', amount: number) => boolean;
        SetClothConfig: (config: ClothConfig, skipApply: boolean) => void;
        GetMoney: (type: 'money' | 'marked_money') => number;
        SetJobDuty: (onDuty: boolean) => void;
    };
    PlayerData: PlayerData;
};

export type PlayerData = {
    address: string;
    apartment: any;
    citizenid: string;
    license: string;
    name: string;
    money: {
        marked_money: number;
        money: number;
    };
    charinfo: PlayerCharInfo;
    role: SozRole;
    metadata: PlayerMetadata;
    job: PlayerJob;
    items: Record<string, InventoryItem> | InventoryItem[];
    skin: Skin;
    cloth_config: ClothConfig;
    source: number;
};

// TODO: Finish to implement the other properties
export type Skin = {
    Hair: {
        HairType: number;
    };
    Model: {
        Hash: number;
    };
};

export const PlayerPedHash = {
    Male: 1885233650,
    Female: -1667301416,
};

export type PlayerCharInfo = {
    firstname: string;
    lastname: string;
    account: string;
    gender: number;
    phone: string;
};

export type PlayerJob = {
    onduty: boolean;
    id: JobType;
    grade: number | string;
};

export type PlayerHealthBook = {
    health_book_health_level: number | null;
    health_book_max_stamina: number | null;
    health_book_strength: number | null;
    health_book_stress_level: number | null;
    health_book_fiber: number | null;
    health_book_lipid: number | null;
    health_book_sugar: number | null;
    health_book_protein: number | null;
};

export type PlayerServerStateExercise = {
    pushUp: boolean;
    sitUp: boolean;
    chinUp: boolean;
    freeWeight: boolean;
};

export type PlayerServerState = {
    yoga: boolean;
    lostStamina: number;
    lostStrength: number;
    runTime: number;
    exercisePushUp: boolean;
    exercise: PlayerServerStateExercise & {
        completed: number;
    };
    lastStrengthUpdate: Date;
    lastMaxStaminaUpdate: Date;
    lastStressLevelUpdate: Date;
};

export type PlayerClientState = {
    isDead: boolean;
    isInventoryBusy: boolean;
    isHandcuffed: boolean;
    isZipped: boolean;
    isEscorted: boolean;
    isEscorting: boolean;
    escorting: number | null;
    isInShop: boolean;
    isInHospital: boolean;
    isInHub: boolean;
    disableMoneyCase: boolean;
    tankerEntity: number | null;
    hasPrisonerClothes: boolean;
    isWearingPatientOutfit: boolean;
    isLooted: boolean;
};

export enum PlayerLicenceType {
    Car = 'car',
    Truck = 'truck',
    Moto = 'motorcycle',
    Boat = 'boat',
    Heli = 'heli',
    Weapon = 'weapon',
    Fishing = 'fishing',
    Hunting = 'hunting',
    Rescuer = 'rescuer',
}

export type PlayerListStateKey = 'dead' | 'zipped' | 'wearingPatientOutfit';

export enum PlayerCriminalState {
    None,
    Allowed,
}

export type PlayerInsideState = {
    apartment: number | false;
    property: number | null;
    exitCoord: { x: number; y: number; z: number } | false;
};

export type PlayerMetadata = PlayerHealthBook & {
    godmode: boolean;
    isdead: boolean;
    ishandcuffed: boolean;
    inlaststand: boolean;
    health: number;
    hunger: number;
    thirst: number;
    alcohol: number;
    drug: number;
    fiber: number;
    lipid: number;
    sugar: number;
    protein: number;
    max_stamina: number;
    max_health: number;
    strength: number;
    stress_level: number;
    health_level: number;
    armor: {
        current: number;
        hidden: boolean;
    };
    organ: Organ | null;
    walk: string | null;
    disease: Disease | null;
    last_disease_at: number | null;
    // Typing is intentionally in that way so that you could program future items that gives clothes.
    isWearingItem: 'zevent2022_tshirt' | null;
    gym_subscription_expire_at: number | null;
    halloween2022: Halloween2022 | null;
    licences: Partial<Record<PlayerLicenceType, number>>;
    shortcuts: Record<number, Partial<InventoryItem>>;
    mort: string | null;
    missive_count: number;
    criminal_state: PlayerCriminalState;
    criminal_reputation: number;
    criminal_talents: Talent[];
    vehiclelimit: number;
    inside: PlayerInsideState;
    injuries_count: number;
    injuries_date: number;
    itt: boolean;
    hazmat: boolean;
    mood?: string | null;
    rp_death: boolean;
};

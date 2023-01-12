import { SozRole } from '@core/permissions';
import { Talent } from '@private/shared/talent';

import { ClothConfig } from './cloth';
import { Disease } from './disease';
import { InventoryItem } from './item';
import { JobType } from './job';
import { Halloween2022 } from './story/halloween2022';

export type QBCorePlayer = {
    Functions: {
        SetMetaData: (key: string, val: any) => void;
        Save: () => void;
        UpdateMaxWeight: () => void;
        AddMoney: (type: 'money' | 'marked_money', amount: number) => boolean;
        RemoveMoney: (type: 'money' | 'marked_money', amount: number) => boolean;
        SetClothConfig: (config: ClothConfig, skipApply: boolean) => void;
    };
    PlayerData: PlayerData;
};

export type PlayerData = {
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
    Model: {
        Hash: number;
    };
};

export type PlayerCharInfo = {
    firstname: string;
    lastname: string;
    account: string;
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

export enum PlayerLicenceType {
    Car = 'car',
    Truck = 'truck',
    Moto = 'moto',
    Boat = 'boat',
    Heli = 'heli',
    Weapon = 'weapon',
    Fishing = 'fishing',
    Hunting = 'hunting',
    Rescuer = 'rescuer',
}

export enum PlayerCriminalState {
    None,
    Allowed,
}

export type PlayerMetadata = PlayerHealthBook & {
    godmode: boolean;
    isdead: boolean;
    ishandcuffed: boolean;
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
    organ: 'foie' | 'rein' | null;
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
    criminal_state: PlayerCriminalState;
    criminal_reputation: number;
    criminal_talents: Talent[];
};

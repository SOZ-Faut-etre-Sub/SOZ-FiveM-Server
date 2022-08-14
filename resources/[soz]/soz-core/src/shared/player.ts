import { SozRole } from '../core/permissions';
import { InventoryItem } from './item';
import { JobType } from './job';

export type QBCorePlayer = {
    Functions: {
        SetMetaData: (key: string, val: any) => void;
        Save: () => void;
    };
    PlayerData: PlayerData;
};

export type PlayerJob = {
    onduty: boolean;
    job: JobType;
};

export type PlayerData = {
    role: SozRole;
    metadata: PlayerMetadata;
    job: PlayerJob;
    items: Record<string, InventoryItem> | InventoryItem[];
};

export type PlayerMetadata = {
    godmode: boolean;
    isdead: boolean;
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
    strength: number;
    stress_level: number;
    health_level: number;
    armor: {
        current: number;
        hidden: boolean;
    };
    organ: 'foie' | 'rein' | null;
    last_strength_update: string | null;
    last_max_stamina_update: string | null;
    last_stress_level_update: string | null;
};

import { SozRole } from '../core/permissions';
import { Disease } from './disease';
import { InventoryItem } from './item';
import { JobType } from './job';

export type QBCorePlayer = {
    Functions: {
        SetMetaData: (key: string, val: any) => void;
        Save: () => void;
        UpdateMaxWeight: () => void;
    };
    PlayerData: PlayerData;
};

export type PlayerData = {
    charinfo: PlayerCharInfo;
    role: SozRole;
    metadata: PlayerMetadata;
    job: PlayerJob;
    items: Record<string, InventoryItem> | InventoryItem[];
};

export type PlayerCharInfo = {
    firstname: string;
    lastname: string;
};

export type PlayerJob = {
    onduty: boolean;
    id: JobType;
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

export type PlayerMetadata = PlayerHealthBook & {
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
    last_exercise_completed: number | null;
    disease: Disease | null;
};

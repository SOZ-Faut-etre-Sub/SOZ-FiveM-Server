import { PetOrder } from '../animal';

export interface NuiPetManagerMethodMap {
    ShowPetManager: { open: boolean; actions: PetOrder[] };
    Update: PetStats;
}

export interface PetStats {
    dead: boolean;
    hunger: number;
    thirst: number;
    energy: number;
    maxEnergy: number;
}

import { InventoryItem } from '@public/shared/item';

export enum StorageType {
    Ammo = 'ammo',
    Armory = 'armory',
    BossStorage = 'boss_storage',
    CabinetStorage = 'cabinet_storage',
    Cloakroom = 'cloakroom',
    FlavorStorage = 'flavor_storage',
    Fridge = 'fridge',
    FurnitureStorage = 'furniture_storage',
    Inverter = 'inverter',
    LiquorStorage = 'liquor_storage',
    LogProcessing = 'log_processing',
    LogStorage = 'log_storage',
    Organ = 'organ',
    PlankStorage = 'plank_storage',
    RecyclerProcessing = 'recycler_processing',
    SawdustStorage = 'sawdust_storage',
    Seizure = 'seizure',
    Stash = 'stash',
    Storage = 'storage',
    StorageTank = 'storage_tank',
    Trunk = 'trunk',
}

export type Storage = {
    type: StorageType;
    id: string;
    inventory: InventoryItem[];
    maxWeight: number;
    maxSlots: number;
    owner: string;
};

export type SozInventoryModel = {
    id: string;
    label: string;
    users: string[];
    type: string;
    time: number;
    owner: string;
    weight: number;
    slots: number;
    datastore: boolean;
    maxWeight: number;
    changed: boolean;
    items: InventoryItem[];
}


/*
 * Get from gta-server/resources/[soz]/soz-core/src/shared/item.ts
 * Can be removed after soz-inventory moves to soz-core
 */
export type InventoryItem = {
    name: string;
    label: string;
    description: string;
    weight: number;
    slot: number;
    useable: boolean;
    usableLabel?: string;  // added by inventory on the fly
    unique: boolean;
    type: ItemType;
    amount: number;
    metadata?: InventoryItemMetadata;
    shouldClose?: boolean;
    illustrator?: Record<string, string> | string;
    disabled?: boolean; // added by inventory on the fly
    shortcut?: string | null; // added by inventory on the fly
};

export type ItemType =
    | 'item'
    | 'weapon'
    | 'weapon_ammo'
    | 'drug'
    | 'food'
    | 'drink'
    | 'cocktail'
    | 'item_illegal'
    | 'organ'
    | 'oil'
    | 'oil_and_item'
    | 'log'
    | 'sawdust'
    | 'plank'
    | 'flavor'
    | 'furniture'
    | 'liquor'
    | 'outfit'
    | 'key'
    | 'fishing_rod'
    | 'fishing_bait'
    | 'crate'
    | 'fish'
    | 'fishing_garbage';

export type MealMetadata = {
        name: string;
        metadata: InventoryItemMetadata;
        amount: number;
        label: string;
        weight: number;
};

export type BaitMetadata = {
    name: string;
    metadata: InventoryItemMetadata;
    label: string;
};
    
export type InventoryItemMetadata = {
    label?: string;
    type?: string;
    expiration?: string;
    player?: number;
    tier?: number;
    // Weapom
    serial?: string;
    health?: number;
    maxHealth?: number;
    ammo?: number;
    tint?: number;
    attachments?: Record<string, string | null>;
    crafted?: boolean;
    crateElements?: MealMetadata[];
    bait?: BaitMetadata;
    weight?: number;
    length?:number;
};



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
    unique: boolean;
    type: ItemType;
    amount: number;
    metadata?: InventoryItemMetadata;
    shouldClose?: boolean;
    illustrator?: string;
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
    | 'key';

export type InventoryItemMetadata = {
    label?: string;
    type?: string;
    expiration?: string;
    player?: number;
    // Weapom
    serial?: string;
    health?: number;
    maxHealth?: number;
    ammo?: number;
    tint?: number;
    attachments?: Record<string, string | null>;
};

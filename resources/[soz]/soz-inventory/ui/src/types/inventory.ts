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
    giveLabel?: string; // added by inventory on the fly
    unique: boolean;
    type: ItemType;
    amount: number;
    metadata?: InventoryItemMetadata;
    shouldClose?: boolean;
    illustrator?: Record<string, string> | string;
    disabled?: boolean; // added by inventory on the fly
    shortcut?: string | null; // added by inventory on the fly
    storageItemType?: string | null;
    openStorageLabel?: string | null;
    canShow?: boolean;
    throwable?: boolean;
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
    | 'zkea_crate'
    | 'fish'
    | 'fishing_garbage'
    | 'tool'
    | 'card'
    | 'evidence'
    | 'smuggling_ore';

export type MealMetadata = {
        name: string;
        metadata: InventoryItemMetadata;
        amount: number;
        label: string;
        weight: number;
};

export type ZkeaFournitureMetadata = {
    type: string;
    name: string;
    model: string;
};

export type BaitMetadata = {
    name: string;
    metadata: InventoryItemMetadata;
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

export type InventoryItemMetadata = {
    label?: string;
    type?: string;
    creation?: string;
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
    zkeaCrateElements?: ZkeaFournitureMetadata[];
    bait?: BaitMetadata;
    fuel?: number;
    weight?: number;
    length?:number;
    iban?: string;
    serializedDetectiveBoard?: any;
    originalDetectiveBoard?: boolean;
    photosInDetectiveBoard?: string[];
    evidenceInfos?: EvidenceMetadata;
    photoUrl?: string;
    printed?: boolean;
    value?: number;
    storageElements?: InventoryItem[];
    notSearchable?: boolean;
};



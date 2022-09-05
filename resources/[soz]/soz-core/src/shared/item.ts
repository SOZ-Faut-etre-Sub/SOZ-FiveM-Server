export type ItemType =
    | 'item'
    | 'weapon'
    | 'weapon_ammo'
    | 'drug'
    | 'food'
    | 'drink'
    | 'item_illegal'
    | 'organ'
    | 'oil'
    | 'oil_and_item'
    | 'log'
    | 'sawdust'
    | 'plank';

type BaseItem = {
    name: string;
    label: string;
    pluralLabel?: string;
    weight: number;
    description: string;
    unique: boolean;
    useable: boolean;
};

export type Nutrition = {
    hunger: number;
    thirst: number;
    alcohol: number;
    stamina: number;
    fiber: number;
    lipid: number;
    sugar: number;
    protein: number;
};

export type WeaponItem = BaseItem & {
    type: 'item';
};

export type AmmoItem = BaseItem & {
    type: 'item';
};

export type DrugItem = BaseItem & {
    type: 'item';
};

export type CommonItem = BaseItem & {
    type: 'item';
};

export type IllegalItem = BaseItem & {
    type: 'item_illegal';
};

export type OrganItem = BaseItem & {
    type: 'organ';
};

export type OilItem = BaseItem & {
    type: 'oil' | 'oil_and_item';
};

export type LogItem = BaseItem & {
    type: 'log';
};

export type SawdustItem = BaseItem & {
    type: 'sawdust';
};

export type PlankItem = BaseItem & {
    type: 'plank';
};

// Fight For Style
export type SewingRawMaterialItem = BaseItem & {
    type: 'item';
};

export type FabricItem = BaseItem & {
    type: 'item';
};

export type GarmentItem = BaseItem & {
    type: 'item';
};

type AnimationItem = {
    name: string;
    dictionary: string;
    flags: number;
};

export type FoodItem = BaseItem & {
    type: 'food';
    nutrition: Nutrition;
    animation?: AnimationItem;
};

export type DrinkItem = BaseItem & {
    type: 'drink';
    nutrition: Nutrition;
    animation?: AnimationItem;
};

export type InventoryItemMetadata = {
    expiration?: string;
    serial?: string;
    player?: number;
};

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
};

export type Item =
    | WeaponItem
    | AmmoItem
    | DrugItem
    | CommonItem
    | IllegalItem
    | OrganItem
    | OilItem
    | LogItem
    | SawdustItem
    | PlankItem
    | FoodItem
    | DrinkItem
    | SewingRawMaterialItem
    | FabricItem
    | GarmentItem;

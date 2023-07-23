import { DrugContractInfo } from '@private/shared/drugs';
import { MissiveType } from '@private/shared/missive';

import { WeaponComponentType } from './weapons/attachment';
import { WeaponMk2TintColor, WeaponTintColor } from './weapons/tint';

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
    | 'fish'
    | 'fishing_garbage'
    | 'outfit';

type BaseItem = {
    name: string;
    label: string;
    pluralLabel?: string;
    weight: number;
    description: string;
    unique: boolean;
    useable: boolean;
    carrybox: string;
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
    drug: number;
    stress: number;
};

export type WeaponItem = BaseItem & {
    type: 'item';
};

export type AmmoItem = BaseItem & {
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

// BAUN
export type FlavorItem = BaseItem & {
    type: 'flavor';
};

export type FurnitureItem = BaseItem & {
    type: 'furniture';
};

export type LiquorItem = BaseItem & {
    type: 'liquor';
    nutrition: Nutrition;
    animation?: AnimationItem;
    prop?: PropItem;
};

export type FishItem = BaseItem & {
    type: 'fish';
    fishing_area: Array<string>;
    fishing_weather: Array<string>;
    fishing_period: Array<string>;
    min_weight: number;
    max_weight: number;
    min_length: number;
    max_length: number;
    sozedex_id: number;
    fishman_status: string;
};

export type FishingGarbageItem = BaseItem & {
    type: 'fishing_garbage';
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

export type OutfitItem = BaseItem & {
    type: 'outfit';
};

type AnimationItem = {
    name: string;
    dictionary: string;
    flags: number;
};

type PropItem = {
    model: string;
    bone: number;
    coords: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
};

export type FoodItem = BaseItem & {
    type: 'food';
    nutrition: Nutrition;
    animation?: AnimationItem;
    prop?: PropItem;
};

export type DrinkItem = BaseItem & {
    type: 'drink';
    nutrition: Nutrition;
    animation?: AnimationItem;
    prop?: PropItem;
};

export type CocktailItem = BaseItem & {
    type: 'cocktail';
    nutrition: Nutrition;
    animation?: AnimationItem;
    prop?: PropItem;
};

export type DrugItem = BaseItem & {
    type: 'drug';
    nutrition: Nutrition;
};

export type MealMetadata = {
    name: string;
    metadata: InventoryItemMetadata;
    amount: number;
    label: string;
};

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
    tint?: WeaponTintColor | WeaponMk2TintColor;
    missiveType?: MissiveType;
    missiveChoice1?: number;
    missiveChoice2?: number;
    missiveChoice3?: number;
    attachments?: Record<WeaponComponentType, string | null>;
    tier?: number;
    crafted?: boolean;
    id?: string;
    model?: string;
    crateElements?: MealMetadata[];
    // Fishing
    weight?: number;
    length?: number;
    bait?: any;
    drugContract?: DrugContractInfo;
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
    | FlavorItem
    | FurnitureItem
    | LiquorItem
    | FoodItem
    | DrinkItem
    | CocktailItem
    | SewingRawMaterialItem
    | FabricItem
    | GarmentItem
    | OutfitItem
    | FishItem
    | FishingGarbageItem;

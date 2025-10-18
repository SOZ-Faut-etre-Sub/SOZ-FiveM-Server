import { InventoryItemMetadata } from '@public/shared/inventory';

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
    | 'outfit'
    | 'tool'
    | 'evidence'
    | 'metal'
    | 'fishing_rod'
    | 'fishing_bait'
    | 'crate'
    | 'drug_pot'
    | 'energy'
    | 'veh_biz_piece'
    | 'smuggling_export'
    | 'smuggling_convoy_export'
    | 'smuggling_ore'
    | 'smuggling_electronic'
    | 'zkea_crate'
    | 'card'
    | 'apparel';

type BaseItem = {
    name: string;
    label: string;
    pluralLabel?: string;
    weight: number;
    description: string;
    unique: boolean;
    useable: boolean;
    carrybox: string;
    carrybox_allow_sprint?: boolean;
    maxplates?: number;
    expiresIn?: number;
    durability?: number;
    storageItemType?: ItemType;
    storageItemWeight?: number;
    storageItemMandatoryMetadata?: keyof InventoryItemMetadata;
    onlyone?: boolean;
    illustrator?: Record<string, string> | string;
    canShow?: boolean;
    throwable?: boolean;
    openStorageLabel?: string;
    resellPrice?: number | number[];
    resellZone?: string;
    resellItemTierMultiplier?: number[];
    drug_pot?: {
        target: string;
        ingredient: string;
        nbIngredient: number;
    };
    maxStack?: number;
    notSearchable?: boolean;
    notGiveable?: boolean;
    canEngrave?: boolean;
    packItem?: string;
    packQuantity?: number;
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
    type: 'weapon';
};

export type AmmoItem = BaseItem & {
    type: 'weapon_ammo';
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

export type ToolItem = BaseItem & {
    type: 'tool';
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

// DMC
export type MetalItem = BaseItem & {
    type: 'metal';
};

export type FishItem = BaseItem & {
    type: 'fish';
    fishing_area: Array<string>;
    fishing_weather: Array<string>;
    fish_generation: 'classic' | 'halloween' | 'christmas' | 'dlc_fish_1' | 'summer' | 'vampire' | 'winter';
    fishing_period: Array<string>;
    min_weight: number;
    max_weight: number;
    min_length: number;
    max_length: number;
    sozedex_id: number;
    fishman_status: string;
    price: number;
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

export type CrateItem = BaseItem & {
    type: 'crate';
};

export type CardItem = BaseItem & {
    type: 'card';
};

export type EvidenceItem = BaseItem & {
    type: 'evidence';
};

export type SmugglingElectronic = BaseItem & {
    type: 'smuggling_electronic';
};

export type Apparel = BaseItem & {
    type: 'apparel';
    slot: number;
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

export type DrugPotItem = BaseItem & {
    type: 'drug_pot';
    drug_pot: {
        target: string;
        ingredient: string;
        nbIngredient: number;
    };
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
    | FishingGarbageItem
    | ToolItem
    | MetalItem
    | CrateItem
    | DrugPotItem
    | CardItem
    | EvidenceItem
    | SmugglingElectronic
    | Apparel;

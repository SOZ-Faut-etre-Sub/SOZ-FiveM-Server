import { TargetOptions } from '../client/target/target.factory';
import { Component, OutfitItem, Prop } from './cloth';
import { InventoryItemMetadata, Item, ItemType } from './item';
import { JobType } from './job';
import { PlayerLicenceType } from './player';
import { Zone } from './polyzone/box.zone';
import { Vector3 } from './polyzone/vector';

export enum ClothingBrand {
    PONSONBYS = 'ponsonbys',
    SUBURBAN = 'suburban',
    BINCO = 'binco',
}

// Superette
export type ShopProduct = {
    id: string;
    type: ItemType;
    item?: Item;
    metadata?: Partial<InventoryItemMetadata>;
    requiredLicense?: PlayerLicenceType;
    price: number;
};

// Boss
export type ShopConfig = {
    name: string;
    zone: Zone;
    targets: TargetOptions[];
    products: ShopProduct[];
};

export type BossShopMenu = {
    job: JobType;
    products: ShopProduct[];
};

// Clothing
export type ClothingShop = {
    id: number;
    name: string;
    categories?: Record<number, ClothingShopCategory>;
    stocks?: Record<number, number>;
};

export type ClothingShopCategory = {
    id: number;
    name: string;
    parentId?: number;
    content?: Record<string, ClothingShopItem[]>; // Map modelLabel -> list of items
};

export type ClothingShopItem = {
    id: number;
    shopId: number;
    categoryId?: number;
    label: string;
    modelLabel?: string;
    colorLabel?: string;
    price: number;
    modelHash?: number;
    components?: Record<Component, OutfitItem>;
    props?: Record<Prop, OutfitItem>;
    correspondingDrawables?: Record<number, number>; // This is for torso compatibility (for gloves)
    undershirtType?: number; // This is for top compatibility (for undershirt)
    underTypes?: number[]; // This is for undershirt compatibility (for tops)
};

export type ClothingShopItemData = {
    components?: Record<Component, OutfitItem>;
    props?: Record<Prop, OutfitItem>;
    label?: string;
    modelHash?: number;
    correspondingDrawables?: Record<number, number>; // This is for torso compatibility (for gloves)
    undershirtType?: number; // This is for top compatibility (for undershirt)
    underTypes?: number[]; // This is for undershirt compatibility (for tops)
    modelLabel?: string;
    colorLabel?: string;
};

// Tattoo
export type TattooShopItem = {
    Name?: string;
    LocalizedName?: string;
    Collection?: string;
    HashNameMale?: string;
    HashNameFemale?: string;
    Zone?: string;
    Price?: number;
};

export type TattooShopCategory = {
    label: string;
    cam: Vector3[];
    player: Vector3;
};

// Jewelry
export type JewelryShopItem = {
    label: string;
    overlay: string;
    components?: Record<Component, OutfitItem> | null;
    props?: Record<Prop, OutfitItem> | null;
    price: number;
};

export type ShopJewelryCategory = {
    categoryId: number;
    propId?: Prop;
    componentId?: Component;
    overlay: string;
    price: number;
    items: Record<string, Record<string, Record<string, { GXT?: string; Localized: string }>>>;
};

export type ShopJewelryContent = Record<string, ShopJewelryCategory>;

// Barber
export type BarberShopLabelEntry = {
    value: number;
    label: string;
};
export type BarberShopColorEntry = {
    value: number;
    label: string;
    r: number;
    g: number;
    b: number;
};
export type BarberShopLabels = Record<string, BarberShopLabelEntry[]>;
export type BarberShopColors = Record<string, BarberShopColorEntry[]>;

export type BarberShopCategory = {
    price: number;
    category: string;
    label: string;
    overlay: string;
    components: Record<string, boolean>;
    items: BarberShopLabelEntry[];
};

export type BarberShopContent = Record<number, BarberShopCategory[]>;

export type BarberConfiguration = {
    Hair: {
        HairType?: number;
        HairColor?: number;
        HairSecondaryColor?: number;
        BeardType?: number;
        BeardColor?: number;
    };
    Makeup: {
        FullMakeupType?: number;
        FullMakeupOpacity?: number;
        FullMakeupPrimaryColor?: number;
        FullMakeupSecondaryColor?: number;
        BlushType?: number;
        BlushOpacity?: number;
        BlushColor?: number;
        LipstickType?: number;
        LipstickOpacity?: number;
        LipstickColor?: number;
    };
};

export type BarberShopItem = {
    config: BarberConfiguration;
    price: number;
    overlay: string;
};

import { Talent } from '@private/shared/talent';
import { InventoryItem, InventoryItemMetadata } from '@public/shared/item';

export type CriminalCraftingRequirements = {
    items: Record<string, number>;
    talent: Talent;
    expire: boolean;
    metadata?: InventoryItemMetadata;
};

export type CriminalCraftingCheckItem = {
    check: boolean;
    count: number;
};

export type CriminalCraftingCheck = {
    items: Record<string, CriminalCraftingCheckItem>;
    talent: boolean;
    amount: number;
    canCraft: boolean;
};

export type CriminalCraftingSalvage = {
    item: InventoryItem;
    results: Record<string, number>;
};

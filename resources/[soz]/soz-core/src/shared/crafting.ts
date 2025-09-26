import { Talent } from '@private/shared/talent';
import { InventoryItem, InventoryItemMetadata } from '@public/shared/inventory';
import { PlayerMetadata } from '@public/shared/player';

import { Feature } from './features';

export type CriminalCraftingRequirements = {
    items: Record<string, number>;
    talent: Talent;
    expire: boolean;
    noExtendExpiration?: boolean;
    metadata?: InventoryItemMetadata;
    outputCount?: number;
    resell: number;
    feature?: Feature;
    corbin?: boolean;
    metadataRequired?: keyof PlayerMetadata;
};

export type CriminalCraftingCheckItem = {
    check: boolean;
    checkAmount: number;
    count: number;
};

export type CriminalCraftingCheck = {
    items: Record<string, CriminalCraftingCheckItem>;
    talent: boolean;
    amount: number;
    canCraft: boolean;
    outputCount?: number;
};

export type CriminalCraftingSalvage = {
    item: InventoryItem;
    results: Record<string, number>;
};

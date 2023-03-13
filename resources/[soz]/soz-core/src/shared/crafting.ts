import { Talent } from '@private/shared/talent';

export type CriminalCraftingRequirements = {
    items: Record<string, number>;
    talent: Talent;
    expire: boolean;
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

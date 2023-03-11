import { CriminalCraftingCheck, CriminalCraftingRequirements } from '@public/shared/crafting';

export const CriminalCraftingRecipes: Record<string, CriminalCraftingRequirements> = {};

export type CriminalCraftingList = Record<keyof typeof CriminalCraftingRecipes, CriminalCraftingCheck>;

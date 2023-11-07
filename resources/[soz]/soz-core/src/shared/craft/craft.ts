import { AnimationInfo } from '../animation';
import { Feature } from '../features';
import { InventoryItemMetadata } from '../item';
import { JobType } from '../job';
import { BaunCraftsLists } from '../job/baun';
import { DmcCraftsLists } from '../job/dmc';
import { FDFCraftsLists } from '../job/fdf';
import { FFSCraftsLists } from '../job/ffs';
import { FoodCraftsLists } from '../job/food';
import { PawlCraftsLists } from '../job/pawl';

export type CraftCategory = {
    recipes: Record<string, CraftRecipe>;
    duration: number;
    feature?: Feature;
    icon?: string;
    animation?: AnimationInfo;
    event: string;
};

export type CraftRecipe = {
    inputs: Record<string, CraftInput>;
    amount: number;
    canCraft?: boolean;
    rewardTier?: Record<string, CraftRewardTier>;
};

export type CraftRewardTier = {
    id: number;
    chance: number;
};

export type CraftInput = {
    check?: boolean;
    count: number;
    metadata?: InventoryItemMetadata;
};

export type CraftsList = {
    cancelled: boolean;
    type: string;
    categories: Record<string, CraftCategory>;
    title?: string;
    subtitle?: string;
};

export const Crafts: Record<string, Record<string, CraftCategory>> = {
    [JobType.Food]: FoodCraftsLists,
    [JobType.Baun]: BaunCraftsLists,
    [JobType.Ffs]: FFSCraftsLists,
    [JobType.Pawl]: PawlCraftsLists,
    [JobType.FDF]: FDFCraftsLists,
    [JobType.DMC]: DmcCraftsLists,
};

export const CraftEvent: Record<string, string> = {
    [JobType.Food]: 'job_cm_food_craft',
    [JobType.Baun]: 'job_baun_craft',
    [JobType.Ffs]: 'job_ffs_craft',
    [JobType.Pawl]: 'job_pawl_craft',
    [JobType.DMC]: 'job_dmc_craft',
};

import { AnimationInfo } from '../animation';
import { Feature } from '../features';
import { JobType } from '../job';
import { BaunCraftsLists } from '../job/baun';
import { FFSCraftsLists } from '../job/ffs';
import { FoodCraftsLists } from '../job/food';
import { PawlCraftsLists } from '../job/pawl';

export type CraftCategory = {
    recipes: Record<string, CraftRecipe>;
    duration: number;
    feature?: Feature;
    icon?: string;
    animation?: AnimationInfo;
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
};

export const CraftEvent: Record<string, string> = {
    [JobType.Food]: 'job_cm_food_craft',
    [JobType.Baun]: 'job_baun_craft',
    [JobType.Ffs]: 'job_ffs_craft',
    [JobType.Pawl]: 'job_pawl_craft',
};

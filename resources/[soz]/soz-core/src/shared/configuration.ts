import { VampireGameCollection, VampireGameObjectiveTypePart2, VampireGameRole } from '@public/shared/halloween';

export type JobTaxTier = {
    Tier1: number;
    Tier2: number;
    Tier3: number;
    Tier4: number;
    Tier1Percentage: number;
    Tier2Percentage: number;
    Tier3Percentage: number;
    Tier4Percentage: number;
    Tier5Percentage: number;
};

export type Water = {
    level: number;
};

export type VampireGame = {
    gameDuration: number;

    roleMaxNumber: Record<VampireGameRole, number>;
    excludedPlayers: Array<string>;

    mortalObjectivePart1: Record<Exclude<VampireGameCollection, 'player'>, number>;
    mortalObjectivePart2: Record<VampireGameObjectiveTypePart2, number>;
    mortalObjectivePart3Duration: number;
};

export type Configuration = {
    JobTaxTier: JobTaxTier;
    Water: Water;
    VampireGame: VampireGame;
};

export const DEFAULT_CONFIGURATION: Configuration = {
    JobTaxTier: {
        Tier1: 1_000_000,
        Tier2: 2_000_000,
        Tier3: 4_000_000,
        Tier4: 5_000_000,
        Tier1Percentage: 0,
        Tier2Percentage: 4,
        Tier3Percentage: 8,
        Tier4Percentage: 12,
        Tier5Percentage: 16,
    },
    Water: {
        level: 10,
    },
    VampireGame: {
        gameDuration: 90,
        roleMaxNumber: {
            [VampireGameRole.Vampire]: 20,
            [VampireGameRole.Ghoul]: 0,
            [VampireGameRole.Hunter]: 10,
            [VampireGameRole.Mortal]: 60,
            [VampireGameRole.Squire]: 5,
            [VampireGameRole.Alchemist]: 5,
        },
        excludedPlayers: [],
        mortalObjectivePart1: {
            prop_streetlight: 30,
            prop_fire_hydrant: 30,
            prop_gas_pump: 10,
            prop_elecbox: 30,
        },
        mortalObjectivePart2: {
            battery: 15,
            dam: 15,
            vampire: 20,
            weapon: 15,
        },
        mortalObjectivePart3Duration: 10,
    },
};

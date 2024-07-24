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

export type Configuration = {
    JobTaxTier: JobTaxTier;
    Water: Water;
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
};

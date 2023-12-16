export enum Feature {
    MyBodySummer = 'MyBodySummer',
    Halloween = 'Halloween',
    HalloweenScenario1 = 'HalloweenScenario1',
    HalloweenScenario2 = 'HalloweenScenario2',
    HalloweenScenario3 = 'HalloweenScenario3',
    HalloweenScenario4 = 'HalloweenScenario4',
    Halloween2023Scenario1 = 'Halloween2023Scenario1',
    Halloween2023Scenario2 = 'Halloween2023Scenario2',
    Halloween2023Scenario3 = 'Halloween2023Scenario3',
    Halloween2023Scenario4 = 'Halloween2023Scenario4',
    ChainsOfJustice = 'ChainsOfJustice',
    HalloweenReboot = 'HalloweenNight',
    Boat = 'Boat',
    Easter = 'Easter',
    NewHorizon = 'NewHorizon',
    Winter = 'Winter',
}

export type Environment = 'development' | 'production' | 'test';

const FeatureConfig: Record<Feature, { [P in Environment]?: boolean }> = {
    [Feature.ChainsOfJustice]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.MyBodySummer]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.Halloween]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.HalloweenReboot]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.HalloweenScenario1]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.HalloweenScenario2]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.HalloweenScenario3]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.HalloweenScenario4]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.Halloween2023Scenario1]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.Halloween2023Scenario2]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.Halloween2023Scenario3]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.Halloween2023Scenario4]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.Boat]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.Easter]: {
        production: false,
        development: false,
        test: false,
    },
    [Feature.NewHorizon]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.Winter]: {
        production: true,
        development: true,
        test: true,
    },
};

export const isFeatureEnabled = (feature: Feature): boolean => {
    const environment = GetConvar('soz_core_environment', 'development') as Environment;

    return !!FeatureConfig[feature][environment];
};

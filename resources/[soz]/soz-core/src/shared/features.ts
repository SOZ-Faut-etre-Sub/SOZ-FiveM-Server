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
        production: true,
        development: true,
        test: true,
    },
    [Feature.HalloweenReboot]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.HalloweenScenario1]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.HalloweenScenario2]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.HalloweenScenario3]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.HalloweenScenario4]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.Halloween2023Scenario1]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.Halloween2023Scenario2]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.Halloween2023Scenario3]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.Halloween2023Scenario4]: {
        production: false,
        development: true,
        test: true,
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
};

export const isFeatureEnabled = (feature: Feature): boolean => {
    const environment = GetConvar('soz_core_environment', 'development') as Environment;

    return !!FeatureConfig[feature][environment];
};

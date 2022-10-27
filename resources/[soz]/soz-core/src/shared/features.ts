export enum Feature {
    MyBodySummer = 'MyBodySummer',
    Halloween = 'Halloween',
    ChainsOfJustice = 'ChainsOfJustice',
    HalloweenReboot = 'HalloweenNight',
}

export type Environment = 'development' | 'production' | 'test';

const FeatureConfig: Record<Feature, { [P in Environment]?: boolean }> = {
    [Feature.MyBodySummer]: {
        production: true,
        development: true,
        test: true,
    },
    [Feature.Halloween]: {
        production: false,
        development: true,
        test: true,
    },
    [Feature.HalloweenReboot]: {
        production: false,
        development: true,
        test: true,
    },
    [Feature.ChainsOfJustice]: {
        development: true,
        test: true,
    },
};

export const isFeatureEnabled = (feature: Feature): boolean => {
    const environment = GetConvar('soz_core_environment', 'development') as Environment;

    return !!FeatureConfig[feature][environment];
};

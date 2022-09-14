export enum Feature {
    MyBodySummer = 'MyBodySummer',
}

export type Environment = 'development' | 'production' | 'test';

const FeatureConfig: Record<Feature, { [P in Environment]?: boolean }> = {
    [Feature.MyBodySummer]: {
        production: false,
        development: true,
        test: false,
    },
};

export const isFeatureEnabled = (feature: Feature): boolean => {
    const environment = GetConvar('soz_core_environment', 'development') as Environment;

    return !!FeatureConfig[feature][environment];
};

import { Configuration, DEFAULT_CONFIGURATION } from '@public/shared/configuration';
import { useSelector } from 'react-redux';

import { RepositoryConfig, RepositoryType } from '../../shared/repository';
import { RootState } from '../store';

export const useRepository = <
    T extends keyof RepositoryConfig,
    K extends keyof RepositoryConfig[T] = keyof RepositoryConfig[T],
    V extends RepositoryConfig[T][K] = RepositoryConfig[T][K]
>(
    type: T
): Record<K, V> => {
    const data = useSelector((state: RootState) => state.repository[type]);

    if (!data) {
        return {} as Record<K, V>;
    }

    return data as Record<K, V>;
};

export const useConfigurationValue = <T extends keyof Configuration>(name: T): Configuration[T] => {
    const configuration = useRepository(RepositoryType.Configuration);
    const value = configuration[name];

    if (!value) {
        return DEFAULT_CONFIGURATION[name];
    }

    return {
        ...DEFAULT_CONFIGURATION[name],
        ...value,
    };
};

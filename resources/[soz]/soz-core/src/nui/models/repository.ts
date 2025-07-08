import { createModel } from '@rematch/core';
import { applyPatch, Operation } from 'fast-json-patch';

import { RepositoryConfig } from '../../shared/repository';
import type { RootModel } from './';

export const repository = createModel<RootModel>()({
    state: {} as RepositoryConfig,
    reducers: {
        set<
            T extends keyof RepositoryConfig,
            K extends keyof RepositoryConfig[T] = keyof RepositoryConfig[T],
            V extends RepositoryConfig[T][K] = RepositoryConfig[T][K],
        >(state, type: T, data: Record<K, V>) {
            return { ...state, [type]: data };
        },
        patch<T extends keyof RepositoryConfig>(state: RepositoryConfig, type: T, patch: Operation[]) {
            const newDocument = applyPatch(state[type], patch, true, false).newDocument;
            return { ...state, [type]: newDocument };
        },
    },
    effects: () => ({}),
});

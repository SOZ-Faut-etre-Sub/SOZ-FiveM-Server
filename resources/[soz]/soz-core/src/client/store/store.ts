import { init, RematchDispatch, RematchRootState } from '@rematch/core';

import { Selector } from '../../core/decorators/selector';
import { models, RootModel } from './models';
export const store = init({
    models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export const StateSelector = (...selector: ((state: RootState) => any)[]) => {
    return Selector<RootState>(...selector);
};

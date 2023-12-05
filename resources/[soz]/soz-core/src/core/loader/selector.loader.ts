import { Store, Unsubscribe } from 'redux';
import { createSelector } from 'reselect';

import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { SelectorMetadata, SelectorMetadataKey } from '../decorators/selector';

const selectorFactory = (selectors: any[], method) => {
    let previousState = [];

    return createSelector(...selectors, (...args) => {
        const result = method(...args, ...previousState);
        previousState = args;

        return result;
    });
};

@Injectable()
export class SelectorLoader<S = any> {
    @Inject('Store')
    private store: Store<S>;

    private unsubscribeList: Unsubscribe[] = [];

    public load(provider): void {
        const selectorMethodList = getMethodMetadata<SelectorMetadata<S>>(SelectorMetadataKey, provider);

        for (const methodName of Object.keys(selectorMethodList)) {
            const selectorMetadata = selectorMethodList[methodName];
            const method = provider[methodName].bind(provider);

            const select = selectorFactory(selectorMetadata.selectors, method);

            const unsubscribe = this.store.subscribe(() => {
                select(this.store.getState() as any);
            });

            this.unsubscribeList.push(unsubscribe);
        }
    }

    public unload(): void {
        for (const unsubscribe of this.unsubscribeList) {
            unsubscribe();
        }

        this.unsubscribeList = [];
    }
}

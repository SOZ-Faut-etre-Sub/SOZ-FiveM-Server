import { setMethodMetadata } from './reflect';

export type SelectorMetadata<T> = {
    selectors: ((state: T) => any)[];
};

export const SelectorMetadataKey = 'soz_core.decorator.selector';

export const Selector = <T>(...selectors: ((state: T) => any)[]) => {
    return (target, propertyKey) => {
        setMethodMetadata(SelectorMetadataKey, { selectors }, target, propertyKey);
    };
};

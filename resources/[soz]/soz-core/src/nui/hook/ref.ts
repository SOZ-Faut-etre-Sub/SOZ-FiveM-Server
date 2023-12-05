import { createRef, RefObject } from 'react';

const map = new Map<string, RefObject<unknown>>();

function setRef<T>(key: string): RefObject<T> {
    const ref = createRef<T>();
    map.set(key, ref);
    return ref;
}

function getRef<T>(key: string): RefObject<T> | undefined | null {
    return map.get(key) as RefObject<T>;
}

function useDynamicRefs<T>(): [(key: string) => null | RefObject<T>, (key: string) => null | RefObject<T>] {
    return [getRef, setRef];
}

export default useDynamicRefs;

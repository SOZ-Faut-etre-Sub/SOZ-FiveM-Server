import { MutableRefObject, useLayoutEffect } from 'react';

export const useIsOverflow = (ref: MutableRefObject<HTMLElement>, onOverflow: (overflow: boolean) => void) => {
    useLayoutEffect(() => {
        const { current } = ref;

        const trigger = () => {
            const hasOverflow = current.scrollWidth > current.clientWidth;

            onOverflow(hasOverflow);
        };

        if (current) {
            trigger();
        }
    }, [onOverflow, ref]);
};

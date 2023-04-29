import { useAllowedOutside } from '@public/nui/hook/data';
import { DependencyList, useCallback, useEffect, useRef } from 'react';

type OutsideEvent = {
    click?: (event) => void;
    up?: (event) => void;
    down?: (event) => void;
};

export const useOutside = (events: OutsideEvent, deps: DependencyList = []) => {
    const allowedOutside = useAllowedOutside();
    const refContainer = useRef(null);
    const eventFactory = useCallback(
        eventFn => {
            if (!eventFn) {
                return () => {};
            }

            return event => {
                if (!document.body.contains(event.target)) {
                    return;
                }

                if (Object.values(allowedOutside).some(ref => ref && ref.contains(event.target))) {
                    return;
                }

                if (
                    (!refContainer.current || !refContainer.current.contains(event.target)) &&
                    document.contains(event.target)
                ) {
                    eventFn(event);
                }
            };
        },
        [refContainer, allowedOutside]
    );

    const onClick = eventFactory(events.click);
    const onUp = eventFactory(events.up);
    const onDown = eventFactory(events.down);

    useEffect(() => {
        if (refContainer !== null) {
            document.addEventListener('click', onClick);
            document.addEventListener('mouseup', onUp);
            document.addEventListener('mousedown', onDown);
        }

        return () => {
            document.removeEventListener('click', onClick);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('mousedown', onDown);
        };
    }, [refContainer, onClick, onUp, onDown, ...deps]);

    return refContainer;
};

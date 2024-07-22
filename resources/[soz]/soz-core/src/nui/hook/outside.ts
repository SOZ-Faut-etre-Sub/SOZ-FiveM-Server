import { useAllowedOutside } from '@public/nui/hook/data';
import { DependencyList, useCallback, useEffect, useRef } from 'react';

type OutsideEvent = {
    click?: (event: MouseEvent) => void;
    up?: (event: MouseEvent) => void;
    down?: (event: MouseEvent) => void;
    contextMenu?: (event: MouseEvent) => void;
};

export const useOutside = (events: OutsideEvent, deps: DependencyList = []) => {
    const allowedOutside = useAllowedOutside();
    const refContainer = useRef(null);
    const eventFactory = useCallback(
        (eventFn: (event: MouseEvent) => void) => {
            if (!eventFn) {
                return () => {};
            }

            return (event: MouseEvent) => {
                if (!document.body.contains(event.target as Node)) {
                    return;
                }

                if (Object.values(allowedOutside).some(ref => ref && ref.contains(event.target as Node))) {
                    return;
                }

                if (
                    (!refContainer.current || !refContainer.current.contains(event.target as Node)) &&
                    document.contains(event.target as Node)
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
    const onContextMenu = eventFactory(events.contextMenu);

    useEffect(() => {
        if (refContainer !== null) {
            document.addEventListener('click', onClick);
            document.addEventListener('mouseup', onUp);
            document.addEventListener('mousedown', onDown);
            document.addEventListener('contextmenu', onContextMenu);
        }

        return () => {
            document.removeEventListener('click', onClick);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('mousedown', onContextMenu);
        };
    }, [refContainer, onClick, onUp, onDown, onContextMenu, ...deps]);

    return refContainer;
};

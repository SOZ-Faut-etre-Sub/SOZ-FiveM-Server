import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import { NuiEvent } from '../../shared/event';
import { eventNameFactory, NuiMethodMap } from '../../shared/nui';
import { fetchNui, FetchNuiOptions } from '../fetch';

function addEventListener<T extends EventTarget, E extends Event>(
    element: T,
    type: string,
    handler: (this: T, evt: E) => void
) {
    element.addEventListener(type, handler as (evt: Event) => void);
}

/**
 * A hook to receive data from the client in the following schema:
 *
 * {
 *   "app": "app-name",
 *   "method": "method-name",
 *   "data": { anyValue: 1 }
 * }
 *
 * @param app {string} The app name which the client will emit to
 * @param method {string} The specific `method` field that should be listened for.
 * @param handler {function} The callback function that will handle data received from the client
 * @returns {void} void
 * @example
 * const [dataState, setDataState] = useState<boolean>();
 * useNuiEvent<boolean>("appname", "methodname", setDataState);
 **/
export const useNuiEvent = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method,
    handler: (r: NuiMethodMap[App][Method]) => void
): void => {
    const savedHandler: MutableRefObject<(r: NuiMethodMap[App][Method]) => void> = useRef();

    // When handler value changes set mutable ref to handler val
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const eventName = eventNameFactory(app, method);
        const eventListener = event => {
            if (savedHandler.current && savedHandler.current.call) {
                const { data } = event;
                savedHandler.current(data as NuiMethodMap[App][Method]);
            }
        };

        addEventListener(window, eventName, eventListener);
        // Remove Event Listener on component cleanup
        return () => window.removeEventListener(eventName, eventListener);
    }, [app, method]);
};

export const useMenuNuiEvent = <M extends keyof NuiMethodMap['menu']>(
    method: M,
    handler: (r: NuiMethodMap['menu'][M]) => void
) => {
    return useNuiEvent('menu', method, handler);
};

type UseNuiResponse<I, R> = [UseNuiFetch<I, R>, { loading: boolean; data: R | null; error: any }];
type UseNuiFetch<I, R> = (input?: I, options?: FetchNuiOptions) => Promise<R>;

/**
 * Make a callback to "myEvent" by sending back "myEventSuccess" or "myEventError" from the client
 * @param event {NuiEvent} needs to be the same here and in the success and error response events
 * @returns {[fetchFn, { loading, error, data }]} [UseNuiCallbackFetch, { loading, error, data }]
 * @example
 * const [fetchUser, { loading, error, data }] = useNuiFetch<number, IUser>(NuiEvent.FETCH_USER);
 * useEffect(() => {
 *  fetchUser(11);
 * }, [fetchUser]);
 */
export const useNuiFetch = <I, R>(event: NuiEvent): UseNuiResponse<I, R> => {
    const [state, setState] = useState({ loading: false, data: null, error: null });

    const fetchNuiFn = useCallback(
        async (input?: I, options?: FetchNuiOptions): Promise<R> => {
            setState({ loading: true, data: null, error: null });

            try {
                const data = await fetchNui<I, R>(event, input, options);
                setState({ loading: false, data, error: null });

                return data;
            } catch (error) {
                setState({ loading: false, data: null, error });

                throw error;
            }
        },
        [event]
    );

    return [fetchNuiFn, state];
};

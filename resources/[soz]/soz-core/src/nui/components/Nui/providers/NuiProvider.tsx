import { useCallback, useEffect, useRef } from 'react';

import { NuiContext } from '../context/NuiContext';
import { eventNameFactory } from '../utils/eventNameFactory';

export interface IAbortableFetch {
    abort: () => void;
    promise: Promise<Response>;
}

function abortableFetch(request, opts): IAbortableFetch {
    const controller = new AbortController();
    const signal = controller.signal;

    return {
        abort: () => controller.abort(),
        promise: fetch(request, { ...opts, signal }),
    };
}

function getParams(resource, event, data): [RequestInfo, RequestInit] {
    return [
        `https://${resource}/${event}`,
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(data),
        },
    ];
}

const DEFAULT_TIMEOUT = 10000;

export const NuiProvider = ({
    resource,
    children,
    timeout,
}: {
    timeout?: number | false;
    resource: string;
    children: JSX.Element;
}): JSX.Element => {
    const resourceRef = useRef<string>(resource || '');
    const timeoutRef = useRef<number>(timeout || DEFAULT_TIMEOUT);

    const eventListener = (event: { data: { app: string; method: string; data: unknown } }) => {
        const { app, method, data } = event.data;
        if (app && method) {
            window.dispatchEvent(
                new MessageEvent(eventNameFactory(app, method), {
                    data,
                })
            );
        }
    };

    useEffect(() => {
        window.addEventListener('message', eventListener);
        return () => window.removeEventListener('message', eventListener);
    }, []);

    const send = useCallback(async (event: string, data = {}) => {
        return fetch(...getParams(resourceRef.current, event, data));
    }, []);

    const sendAbortable = useCallback((event: string, data = {}): IAbortableFetch => {
        return abortableFetch(...getParams(resourceRef.current, event, data));
    }, []);

    return (
        <NuiContext.Provider
            value={{
                send,
                sendAbortable,
                resource: resourceRef.current,
                callbackTimeout: timeoutRef.current,
            }}
        >
            {children}
        </NuiContext.Provider>
    );
};

import { createContext } from 'react';

import { IAbortableFetch } from '../providers/NuiProvider';

export interface NuiContext {
    resource: string;
    callbackTimeout: number;
    send: (e: string, data?: unknown) => Promise<Response>;
    sendAbortable: (e: string, data: unknown) => IAbortableFetch;
}

export const NuiContext = createContext<NuiContext>(null);

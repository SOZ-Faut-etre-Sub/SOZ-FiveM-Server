import { NuiEvent, ServerEvent } from '../shared/event';

export type FetchNuiOptions = {
    timeout: number | false;
};

export const fetchNui = async <I, R>(event: NuiEvent, input?: I, options?: FetchNuiOptions): Promise<R> => {
    const timeout = options?.timeout ?? false;
    const controller = new AbortController();
    const id = timeout ? setTimeout(() => controller.abort(), timeout) : null;

    if (typeof window.GetParentResourceName === 'undefined') {
        return null;
    }

    const response = await fetch(`https://${GetParentResourceName()}/` + event.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(input || null),
        signal: controller.signal,
    });

    if (id) {
        clearTimeout(id);
    }

    return (await response.json()) as R;
};

export const triggerClientEvent = async (event: ServerEvent | string, ...args: any[]): Promise<void> => {
    if (typeof window.GetParentResourceName === 'undefined') {
        return;
    }

    const response = await fetch(`https://${GetParentResourceName()}/${NuiEvent.TriggerClientEvent}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            event: event.toString(),
            args,
        }),
    });

    await response.json();
};

export const triggerServerEvent = async (event: ServerEvent | string, ...args: any[]): Promise<void> => {
    if (typeof window.GetParentResourceName === 'undefined') {
        return;
    }

    const response = await fetch(`https://${GetParentResourceName()}/${NuiEvent.TriggerServerEvent}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            event: event.toString(),
            args,
        }),
    });

    await response.json();
};

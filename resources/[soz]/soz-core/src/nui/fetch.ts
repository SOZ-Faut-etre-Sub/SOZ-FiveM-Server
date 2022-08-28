import { NuiEvent } from '../shared/event';

export type FetchNuiOptions = {
    timeout: number | false;
};

export const fetchNui = async <I, R>(event: NuiEvent, input: I, options?: FetchNuiOptions): Promise<R> => {
    const timeout = options?.timeout ?? false;
    const controller = new AbortController();
    const id = timeout ? setTimeout(() => controller.abort(), timeout) : null;
    const response = await fetch(`https://${GetParentResourceName()}/` + event.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(input),
        signal: controller.signal,
    });

    if (id) {
        clearTimeout(id);
    }

    return (await response.json()) as R;
};

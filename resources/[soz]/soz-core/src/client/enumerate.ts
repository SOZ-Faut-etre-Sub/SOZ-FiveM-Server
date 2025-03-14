export function* enumerate<T, I = any>(
    init: (out?: T) => [I, T],
    next: (iterator: I) => [boolean, T],
    destroy: (iterator: I) => void
): Iterable<T> {
    let iterator = null;
    let object = null;

    [iterator, object] = init();

    if (!object) {
        destroy(iterator);

        return;
    }

    let hasNext = true;

    while (hasNext) {
        yield object;

        [hasNext, object] = next(iterator);
    }

    destroy(iterator);
}

export const GetPedList = () => {
    return enumerate<number>(FindFirstPed, FindNextPed, EndFindPed);
};

export const GetObjectList = () => {
    return enumerate<number>(FindFirstObject, FindNextObject, EndFindObject);
};

export const GetVehicleList = () => {
    return enumerate<number>(FindFirstVehicle, FindNextVehicle, EndFindVehicle);
};

export const GetPickupList = () => {
    return enumerate<number>(FindFirstPickup, FindNextPickup, EndFindPickup);
};

export const GetKvpList = (prefix: string, maxRetry = 3): Record<string, any> => {
    const kvp: Record<string, any> = {};

    const kvpHandle = StartFindKvp(prefix);
    if (!kvpHandle) {
        if (maxRetry <= 0) {
            return kvp;
        }

        return GetKvpList(prefix, maxRetry - 1);
    }

    let kvpKey = FindKvp(kvpHandle);
    while (kvpKey) {
        kvp[kvpKey] = GetResourceKvpString(kvpKey);
        kvpKey = FindKvp(kvpHandle);
    }

    EndFindKvp(kvpHandle);
    return kvp;
};

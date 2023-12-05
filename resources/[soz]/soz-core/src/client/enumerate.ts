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

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

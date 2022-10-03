import PCancelable from 'p-cancelable';

export const wait = (ms: number): PCancelable<boolean> => {
    return new PCancelable(resolve => setTimeout(() => resolve(true), ms));
};

export const waitUntil = (until: () => Promise<boolean>, timeout?: number): PCancelable<boolean> => {
    const cancelable = new PCancelable<boolean>((resolve, reject, onCancel) => {
        const tick = setTick(async () => {
            const result = await until();

            if (result) {
                clearTick(tick);
                resolve(true);
            }
        });

        onCancel.shouldReject = false;
        onCancel(() => {
            clearTick(tick);
            resolve(false);
        });
    });

    if (timeout) {
        setTimeout(() => {
            try {
                cancelable.cancel();
            } catch {
                // do nothing
            }
        }, timeout);
    }

    return cancelable;
};

export const uuidv4 = (): string => {
    let uuid = '';
    for (let ii = 0; ii < 32; ii += 1) {
        switch (ii) {
            case 8:
            case 20:
                uuid += '-';
                uuid += ((Math.random() * 16) | 0).toString(16);
                break;
            case 12:
                uuid += '-';
                uuid += '4';
                break;
            case 16:
                uuid += '-';
                uuid += ((Math.random() * 4) | 8).toString(16);
                break;
            default:
                uuid += ((Math.random() * 16) | 0).toString(16);
        }
    }
    return uuid;
};

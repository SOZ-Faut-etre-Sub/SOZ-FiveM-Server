export const debounce = (fn: (T) => void, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: [T: any]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

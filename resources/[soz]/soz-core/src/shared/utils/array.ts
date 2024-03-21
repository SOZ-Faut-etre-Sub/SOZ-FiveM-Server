// Source code: https://stackoverflow.com/a/62765924
export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce(
        (groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        },
        {} as Record<K, T[]>
    );

export function deepCopy<T>(obj: T): T {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

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

export function deepCompare<T>(obj1: T, obj2: T): boolean {
    // Handle the 3 simple types, and null or undefined
    if (null == obj1 && obj2 != null) {
        return false;
    }
    if (null != obj1 && obj2 == null) {
        return false;
    }
    if (null == obj1 && obj2 == null) {
        return true;
    }

    if ('object' != typeof obj1) {
        if ('object' == typeof obj2) {
            return false;
        }
        return obj1 == obj2;
    }

    // Handle Date
    if (obj1 instanceof Date) {
        if (!(obj2 instanceof Date)) {
            return false;
        }

        return obj1.getTime() == obj2.getTime();
    }

    // Handle Array
    if (obj1 instanceof Array) {
        if (!(obj2 instanceof Array)) {
            return false;
        }

        if (obj1.length != obj2.length) {
            return false;
        }

        for (let i = 0, len = obj1.length; i < len; i++) {
            if (!deepCompare(obj1[i], obj2[i])) {
                return false;
            }
        }
        return true;
    }

    // Handle Object
    if (obj1 instanceof Object) {
        if (!(obj2 instanceof Object)) {
            return false;
        }

        for (const attr in obj1) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj1.hasOwnProperty(attr)) {
                if (!deepCompare(obj1[attr], obj2[attr])) {
                    return false;
                }
            }
        }
        for (const attr in obj2) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj2.hasOwnProperty(attr)) {
                if (!deepCompare(obj1[attr], obj2[attr])) {
                    return false;
                }
            }
        }
        return true;
    }

    console.log(obj1, obj2);
    throw new Error("Unable to compore obj! Its type isn't supported.");
}

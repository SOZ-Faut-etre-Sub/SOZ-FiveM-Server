// Jenkins one at a time algorithm used by gta V to convert string to hash number
// This converts a string to a hash number (int32)
export const joaat = (str: string): number => {
    let hash = 0;

    for (let i = 0; i < str.length; ++i) {
        hash += str.charCodeAt(i);
        hash += hash << 10;
        hash ^= hash >>> 6;
    }

    hash += hash << 3;
    hash ^= hash >>> 11;
    hash += hash << 15;

    return (hash >>> 0) << 0;
};

/**
 * @credits https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

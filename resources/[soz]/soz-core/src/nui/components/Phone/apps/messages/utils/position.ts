export const isVec2Position = (str: string) => {
    return /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.test(str);
};

export const isVec3Position = (str: string) => {
    return /vec3\((-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)\)/g.test(str);
};

export const isPosition = (str: string) => isVec2Position(str) || isVec3Position(str);

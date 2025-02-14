import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';

export const isVec2Position = (str: string) => {
    return /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.test(str);
};

export const isVec3Position = (str: string) => {
    return /vec3\((-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)\)/g.test(str);
};

export const isPosition = (str: string) => isVec2Position(str) || isVec3Position(str);

export const getAddress = async (input: string) => {
    const position = /vec3\((-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)\)/g.exec(input);
    return fetchNui<{ x: number; y: number; z: number }, string[]>(NuiEvent.GetStreetName, {
        x: Number(position[1]),
        y: Number(position[2]),
        z: Number(position[3]),
    });
};

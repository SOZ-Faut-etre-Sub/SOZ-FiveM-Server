import { Vector3, Vector4 } from '../../shared/polyzone/vector';

export const getProperGroundPositionForObject = (
    objectHash: number,
    position: Vector3,
    heading: number,
    offset = 0
): Vector4 => {
    const object = CreateObject(objectHash, position[0], position[1], position[2], false, false, false);
    SetEntityHeading(object, heading);
    SetEntityVisible(object, false, false);
    PlaceObjectOnGroundProperly(object);

    const coords = GetEntityCoords(object, false) as Vector3;
    DeleteObject(object);

    return [coords[0], coords[1], coords[2] + offset, heading];
};

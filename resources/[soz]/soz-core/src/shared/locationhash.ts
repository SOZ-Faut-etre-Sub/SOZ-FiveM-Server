import { joaat } from '@public/shared/joaat';

import { Vector3, Vector4 } from './polyzone/vector';

function twoDigitsFloor(u: number) {
    const base = (Math.floor(u * 100) / 100).toString();
    return base.includes('.') ? base : base + '.0';
}

export function getLocationHash(coords: Vector3 | Vector4) {
    return joaat(`${twoDigitsFloor(coords[0])}_${twoDigitsFloor(coords[1])}_${twoDigitsFloor(coords[2])}`);
}

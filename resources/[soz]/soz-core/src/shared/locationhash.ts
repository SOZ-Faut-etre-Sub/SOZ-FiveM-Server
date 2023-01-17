import { Vector3 } from './polyzone/vector';

function twoDigitsFloor(u: number) {
    const base = (Math.floor(u * 100) / 100).toString();
    return base.includes('.') ? base : base + '.0';
}

export function getLocationHash(coords: Vector3) {
    return GetHashKey(`${twoDigitsFloor(coords[0])}_${twoDigitsFloor(coords[1])}_${twoDigitsFloor(coords[2])}`);
}

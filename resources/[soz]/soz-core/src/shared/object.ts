import { Vector3, Vector4 } from './polyzone/vector';

export type WorldObject = {
    id: string;
    model: number;
    position: Vector4;
    rotation?: Vector3;
    placeOnGround?: boolean;
};

import { Vector4 } from './polyzone/vector';

export type WorldObject = {
    model: string;
    position: Vector4;
    freeze: boolean;
};

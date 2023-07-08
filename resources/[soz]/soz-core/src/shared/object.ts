import { Vector4 } from './polyzone/vector';

export type WorldObject = {
    id?: number;
    model: string;
    event?: string | null;
    position: Vector4;
};

import { Vector3 } from './polyzone/vector';

export type ModelSwap = {
    id: number;
    source: string;
    target?: string;
    position: Vector3;
    range: number;
};

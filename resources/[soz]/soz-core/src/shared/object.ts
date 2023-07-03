import { Vector4 } from './polyzone/vector';

export type WorldObject = {
    model: string;
    position: Vector4;
    freeze: boolean;
};

export type WorldPlacedProp = {
    unique_id: string | null;
    model: string;
    collection: string | null;
    position: Vector4;
    matrix: Float32Array;
    loaded: boolean;
};

export type PropCollectionData = {
    name: string;
    size: number;
    loaded_size: number;
};

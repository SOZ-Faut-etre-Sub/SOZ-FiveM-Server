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

export type DebugProp = {
    entity: number;
    model: string;
    collection: string | null;
    matrix: Float32Array;
};

export type SpawedWorlPlacedProp = WorldPlacedProp & {
    entity: number;
};

export type PropCollection = {
    name: string;
    size: number;
    loaded_size: number;
    props: WorldPlacedProp[];
};

export type SpawnedCollection = {
    name: string;
    size: number;
    loaded_size: number;
    props: SpawedWorlPlacedProp[];
};

export type PropCollectionData = {
    name: string;
    size: number;
    loaded_size: number;
};

export type PropServerData = {
    total: number;
    loaded: number;
};

export type PropClientData = {
    total: number;
    valid: number;
};

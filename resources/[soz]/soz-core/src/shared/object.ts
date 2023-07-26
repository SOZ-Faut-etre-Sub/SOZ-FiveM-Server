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

export type PropCollectionData = {
    name: string;
    creator_citizenID: string;
    creation_date: Date;
    size: number;
    loaded_size: number;
};

export type PropCollection = PropCollectionData & {
    props: Record<string, WorldPlacedProp>;
};

export type SpawnedCollection = PropCollectionData & {
    props: Record<string, SpawedWorlPlacedProp>;
};

export type PropServerData = {
    total: number;
    loaded: number;
};

export type PropClientData = {
    total: number;
    valid: number;
};

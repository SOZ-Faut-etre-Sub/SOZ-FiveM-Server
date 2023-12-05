import { Vector3, Vector4 } from './polyzone/vector';

export type WorldObject = {
    id: string;
    model: number;
    position: Vector4;
    rotation?: Vector3;
    placeOnGround?: boolean;
    matrix?: Float32Array;
    noCollision?: boolean;
};

export type WorldPlacedProp = {
    collection: string;
    loaded: boolean;
    model: string;
    object: WorldObject;
};

export type DebugProp = {
    id: string;
    model: string;
    collection: string;
    matrix: Float32Array;
    collision: boolean;
    position: Vector4;
    entity: number;
    state: PropState;
};

export const enum PropState {
    unplaced = 0,
    placed = 1,
    loaded = 2,
}

export type PropCollectionData = {
    name: string;
    creator_citizenID: string;
    creatorName: string;
    creation_date: Date;
    size: number;
    loaded_size: number;
};

export type PropCollection = PropCollectionData & {
    props: Record<string, WorldPlacedProp>;
};

export type PropServerData = {
    total: number;
    loaded: number;
};

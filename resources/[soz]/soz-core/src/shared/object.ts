import { TargetOptions } from '@public/client/target/target.factory';
import { JobType } from '@public/shared/job';

import { Vector3, Vector4 } from './polyzone/vector';

export type WorldObjectMetadata = {
    gangId?: number;
    index?: number;
    zoneId?: string;
};

export type WorldObject = {
    id: string;
    model: number;
    position: Vector4;
    rotation?: Vector3;
    placeOnGround?: boolean;
    matrix?: Float32Array;
    noCollision?: boolean;
    invisible?: boolean;
    targets?: TargetOptions[];
    metadata?: WorldObjectMetadata;
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
    collection?: string;
    matrix: Float32Array;
    collision: boolean;
    position: Vector4;
    entity: number;
    state: PropState;
};

export type HousingDebugProp = {
    model: string;
    fourniture_id: number;
    matrix: Float32Array;
    position: Vector4;
    initialPosition: Vector4;
    entity: number;
    rotation: Vector3;
    storageType: string;
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
    persistant: boolean;
};

export type PropCollection = PropCollectionData & {
    props: Record<string, WorldPlacedProp>;
};

export type PropServerData = {
    total: number;
    loaded: number;
};

export type ObjectEditorContext = 'hammer' | 'admin' | JobType.Gouv;

export type ObjectEditorOptions = {
    onDrawCallback: (object: WorldObject) => void;
    maxDistance: number;
    allowDelete: boolean;
    allowRotation: boolean;
    allowScale: boolean;
    allowToggleCollision: boolean;
    allowToggleSnap: boolean;
    context: ObjectEditorContext;
    collision: boolean;
    snapToGround: boolean;
};

export type EditorMenuData = Omit<ObjectEditorOptions, 'onDrawCallback'>;
export const CollectionRadius = 400.0;

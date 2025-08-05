import { JobType } from '@public/shared/job';

import { Vfx } from './animation';
import { joaat } from './joaat';
import { Vector3, Vector4 } from './polyzone/vector';

export type WorldObjectMetadata = {
    gangId?: number;
    index?: number;
    zoneId?: string;
    locked?: boolean;
    closed?: boolean;
    job?: JobType;
};

export type WorldObjectGrowth = {
    beginTime: number;
    endTime: number;
    beginSize: number;
    endSize: number;
};

export type WorldObject = {
    id: string;
    model: number;
    position: Vector4;
    rotation?: Vector3;
    placeOnGround?: boolean;
    matrix?: number[];
    noCollision?: boolean;
    invisible?: boolean;
    metadata?: WorldObjectMetadata;
    effect?: string;
    vfx?: Vfx;
    growth?: WorldObjectGrowth;
    highlight?: boolean;
    inventoryId?: string;
    permanent?: boolean;
    alpha?: number;
    rotationOrder?: number;
    textureVariation?: number;
    dynamicTexture?: DynamicTexture;
};

export type WorldPlacedProp = {
    collection: string;
    loaded: boolean;
    model: string;
    object: WorldObject;
};

export type DynamicTexture = {
    url: string;
    index: number;
    baseModel: number;
};

export type DebugProp = {
    id: string;
    model: string;
    collection?: string;
    matrix: number[];
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
    deleteCallback: (object: WorldObject) => void;
    setNameCallback: (object: WorldObject, name: string) => void;
    maxDistance: number;
    allowDuplicate: boolean;
    allowDelete: boolean;
    allowRotation: boolean;
    allowScale: boolean;
    allowToggleCollision: boolean;
    allowToggleSnap: boolean;
    allowTogglePermanent: boolean;
    allowAddEffect: boolean;
    allowSetName: boolean;
    onlyZRotation: boolean;
    context: ObjectEditorContext;
    collision: boolean;
    permanent: boolean;
    effect: string | null;
    vfx: Vfx | null;
    snapToGround: boolean;
    useCircularCamera: boolean;
    initialPosition: Vector4;
};

export type EditorMenuData = Omit<ObjectEditorOptions, 'onDrawCallback'> & {
    object: WorldObject;
};

export const CollectionRadius = 400.0;

export const ForbiddenPropModels = [joaat('vw_prop_notebook_01a')];

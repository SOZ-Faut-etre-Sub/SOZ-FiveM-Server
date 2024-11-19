import { WorldObject } from './object';
import { Vector4 } from './polyzone/vector';

export type EventInfo = {
    currentEventId: string | null;
    currentSceneId: string | null;
    startTimestamp: number;
    signaledInvs: string[];
    unlockInvs: string[];
};

export type WorldEvent = {
    id: string;
    name: string;
    startSound: string | null;
    reward: RewardWorldEvent[];
};

export type RewardWorldEvent = {
    item: string;
    chance: number;
    min: number;
    max: number;
};

export type Scene = {
    id: string;
    name: string;
    persistent: boolean;
    worldEventId?: string;
    owner?: string;
    entities: Record<string, SceneEntity>;
    peds: Record<string, ScenePed>;
};

export type SceneEntity = {
    id: string;
    model: string;
    inventoryId?: string;
    object: WorldObject;
};

export enum ScenePedBehavior {
    passive = 'passive',
    agressive = 'agressive',
}

export type ScenePedData = {
    position: Vector4;
    weapon: string;
    behavior: ScenePedBehavior;
    model: string;
};

export type ScenePed = ScenePedData & {
    id: string;
};

export const ScenePedBehaviorRelationship: Record<ScenePedBehavior, number> = {
    [ScenePedBehavior.passive]: 4,
    [ScenePedBehavior.agressive]: 5,
};

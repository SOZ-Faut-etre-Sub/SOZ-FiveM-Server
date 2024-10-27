import { WorldObject } from './object';

export type EventInfo = {
    currentEventId: string | null;
    currentSceneId: string | null;
    startTimestamp: number;
    signaledInvs: string[];
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
};

export type SceneEntity = {
    id: string;
    model: string;
    inventoryId?: string;
    object: WorldObject;
};

import { LightState, LightStateAnimation, LightStateTransition } from '@public/shared/spotlight';

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
    ownerName?: string;
    entities: Record<string, SceneEntity>;
    peds: Record<string, ScenePed>;
    markers: Record<string, SceneMarker>;
    createdAt: number;
};

export type SceneEntity = {
    id: string;
    model: string;
    userId?: string;
    inventoryId?: string;
    object: WorldObject;
};

export type SceneMarker = SceneMarkerData & {
    id: string;
    userId: string;
};

export type SceneMarkerData = {
    position: Vector4;
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

export const SceneBlipDelay = 60 * 60_000;

export type SceneLiveElement = LiveEffect | LiveLightState | LiveLightTransition | LiveLightAnimation;

export enum LiveEffectType {
    Explosion = 'explosion',
}

export type LiveEffect = {
    id: string;
    type: 'live_effect';
    effectType: LiveEffectType;
    loop: boolean;
    cycle?: number;
    interval: number;
};

export type LiveLightState = {
    id: string;
    type: 'live_light';
    state: Partial<LightState>;
};

export type LiveLightTransition = {
    id: string;
    type: 'live_light_transition';
    transition: LightStateTransition;
};

export type LiveLightAnimation = {
    id: string;
    type: 'live_light_animation';
    animation: LightStateAnimation;
};

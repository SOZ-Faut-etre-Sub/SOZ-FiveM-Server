import { Vector2, Vector3, Vector4 } from './polyzone/vector';

type BaseAnimationConfigItem = {
    name: string;
    rightLabel: string | null;
    icon: string | null;
};

export type AnimationConfigEvent = BaseAnimationConfigItem & {
    type: 'event';
    event: string;
};

export type AnimationConfigScenario = BaseAnimationConfigItem & {
    type: 'scenario';
    scenario: Scenario;
};

export type AnimationConfigAnimation = BaseAnimationConfigItem & {
    type: 'animation';
    animation: Animation;
};

export type AnimationConfigCategory = {
    type: 'category';
    name: string;
    items: AnimationConfigItem[];
};

export type AnimationConfigItem =
    | AnimationConfigEvent
    | AnimationConfigScenario
    | AnimationConfigAnimation
    | AnimationConfigCategory;

export type AnimationConfigList = AnimationConfigItem[];

export type WalkConfigBase = {
    type: 'walk';
    name: string;
    walk: string;
};

export type WalkConfigCategory = {
    type: 'category';
    name: string;
    items: WalkConfigItem[];
};

export enum AnimationStopReason {
    Canceled, // Animation was canceled by the user
    Aborted, // Animation was aborted by an external event (other animation, player died, etc.)
    Finished, // Normal finish, animation is finished
}

export type WalkConfigItem = WalkConfigBase | WalkConfigCategory;

export type WalkConfigList = WalkConfigItem[];

export type MoodConfigItem = {
    name: string;
    mood: string;
};

export type MoodConfigList = MoodConfigItem[];

export type Animation = {
    props?: AnimationProps[];
    enter?: AnimationInfo;
    base: AnimationInfo;
    exit?: AnimationInfo;
};

export type Scenario = {
    name: string;
    duration?: number;
    fixPositionDelta?: Vector2;
    propsCreated?: string[];
    position?: Vector4;
    isSittingScenario?: boolean;
    shouldTeleport?: boolean;
};

export type Vfx = {
    dictionary: string;
    name: string;
    scale: number;
    position: Vector3;
    rotation: Vector3;
    manualLoop?: boolean;
    duration?: number;
};

export type AnimationProps = {
    model: string;
    bone: number;
    position: Vector3;
    rotation: Vector3;
    fx?: Vfx;
};

export type AnimationInfo = {
    dictionary: string;
    name: string;
    duration?: number;
    blendInSpeed?: number;
    blendOutSpeed?: number;
    playbackRate?: number;
    lockX?: boolean;
    lockY?: boolean;
    lockZ?: boolean;
    options?: AnimationOptions;
};

export type PlayOptions = {
    ped: number;
    resetWeapon: boolean;
    clearTasksBefore: boolean;
    clearTasksAfter: boolean;
};

export type AnimationOptions = {
    repeat?: boolean;
    freezeLastFrame?: boolean;
    freezeLastFrameControllable?: boolean;
    onlyUpperBody?: boolean;
    enablePlayerControl?: boolean;
    cancellable?: boolean;
};

export const animationFlagsToOptions = (flags: number): AnimationOptions => {
    return {
        repeat: (flags & 1) > 0,
        freezeLastFrame: (flags & 2) > 0,
        freezeLastFrameControllable: (flags & 4) > 0,
        onlyUpperBody: (flags & 16) > 0,
        enablePlayerControl: (flags & 32) > 0,
        cancellable: (flags & 64) > 0,
    };
};

export const animationOptionsToFlags = (options: AnimationOptions): number => {
    let flags = 0;

    if (options.repeat) {
        flags |= 1;
    }

    if (options.freezeLastFrame) {
        flags |= 2;
    }

    if (options.freezeLastFrameControllable) {
        flags |= 4;
    }

    if (options.onlyUpperBody) {
        flags |= 16;
    }

    if (options.enablePlayerControl) {
        flags |= 32;
    }

    if (options.cancellable) {
        flags |= 64;
    }

    return flags;
};

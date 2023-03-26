export type AnimationOptions = {
    repeat?: boolean;
    freezeLastFrame?: boolean;
    freezeLastFrameControllable?: boolean;
    onlyUpperBody?: boolean;
    enablePlayerControl?: boolean;
    cancellable?: boolean;
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

export type ProgressOptions = {
    audio?: {
        path: string;
        volume?: number;
    };
    useWhileDead: boolean;
    disableNui: boolean;
    canCancel: boolean;
    disableMovement: boolean;
    disableCarMovement: boolean;
    disableMouse: boolean;
    disableCombat: boolean;
    firstProp: ProgressProp;
    secondProp: ProgressProp;
    headingEntity?: {
        entity: number;
        heading: number;
    };
    ignorePollution: boolean;
    start: () => void;
    tick: () => void;
    useAnimationService: boolean;
    no_inv_busy: boolean;
};

export type ProgressAnimation = {
    dictionary?: string;
    name?: string;
    flags?: number;
    task?: string;
    blendInSpeed?: number;
    blendOutSpeed?: number;
    playbackRate?: number;
    options?: AnimationOptions;
};

export type ProgressResult = {
    completed: boolean;
    progress: number;
};

export type ProgressProp = {
    model: string;
    bone: number;
    coords: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
};

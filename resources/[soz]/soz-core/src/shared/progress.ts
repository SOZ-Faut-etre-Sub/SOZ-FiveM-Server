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
    useWhileDead: boolean;
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
};

export type ProgressAnimation = {
    dictionary?: string;
    name?: string;
    flags?: number;
    task?: string;
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

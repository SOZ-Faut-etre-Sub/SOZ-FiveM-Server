import { AnimationOptions, AnimationProps } from '@public/shared/animation';

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
    firstProp?: ProgressProp;
    secondProp?: ProgressProp;
    headingEntity?: {
        entity: number;
        heading: number;
    };
    ignorePollution?: boolean;
    start?: () => void;
    tick?: () => void;
    useAnimationService?: boolean;
    allowExistingAnimation?: boolean;
    no_inv_busy?: boolean;
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
    props?: AnimationProps[];
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

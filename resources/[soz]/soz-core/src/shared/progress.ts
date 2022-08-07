export type ProgressOptions = {
    useWhileDead: boolean;
    canCancel: boolean;
    disableCombat: boolean;
    firstProp: ProgressProp;
    secondProp: ProgressProp;
};

export type ProgressAnimation = {
    dictionary?: string;
    name?: string;
    flags?: number;
    task?: string;
};

export type ProgressResult = {
    completed: boolean;
    progress: number;
};

export type ProgressProp = {
    model: string;
    bone: number;
    coords: { x: number; y: number; z: number };
};

export interface NuiProgressMethodMap {
    Start: Progress;
    Stop: never;
}

export type ProgressUnit = {
    start: number;
    end: number;
    unit: string;
};

export type Progress = {
    label: string;
    duration: number;
    units: ProgressUnit[];
    color?: string;
};

export interface NuiProgressMethodMap {
    Start: Progress;
    Stop: never;
}

type ProgressUnit = {
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

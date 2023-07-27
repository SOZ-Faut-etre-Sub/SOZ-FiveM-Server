import { SplitInfo } from '../race';

export interface NuiRaceMethodMap {
    SetSplits: SplitInfo[];
    setCountDown: string;
    setStart: number;
    setEnd: number;
}

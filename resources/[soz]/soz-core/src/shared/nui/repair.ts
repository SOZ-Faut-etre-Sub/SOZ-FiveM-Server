import { VehicleCondition } from '../vehicle/vehicle';

export interface NuiRepairMethodMap {
    open: RepairAnalyze;
    close: never;
}

export type RepairAnalyze = {
    condition: VehicleCondition;
    doors: number[];
    windows: boolean[];
    tabletType: 'car' | 'electric' | 'trailer';
};

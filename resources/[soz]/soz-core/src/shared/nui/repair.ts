import { VehicleCondition, VehiculeInformation } from '../vehicle/vehicle';

export interface NuiRepairMethodMap {
    open: RepairAnalyze;
    close: never;
}

export type RepairAnalyze = {
    vehiculeInformations: VehiculeInformation;
    condition: VehicleCondition;
    doors: number[];
    windows: boolean[];
    tabletType: 'car' | 'electric' | 'trailer';
};

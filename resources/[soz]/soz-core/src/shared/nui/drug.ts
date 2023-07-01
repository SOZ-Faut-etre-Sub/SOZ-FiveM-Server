import { DrugContractInfo, DrugNuiZone } from '@private/shared/drugs';

export interface NuiDrugMethodMap {
    ShowContract: DrugContractInfo;
    SetLocations: DrugNuiZone[];
    AddUpdateLocation: DrugNuiZone;
    DeleteLocation: number;
    ShowDrugSkill: never;
}

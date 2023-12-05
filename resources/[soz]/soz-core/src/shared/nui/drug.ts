import { DrugContractInfo, DrugNuiZone, DrugTransformList } from '@private/shared/drugs';

export interface NuiDrugMethodMap {
    ShowContract: DrugContractInfo;
    SetLocations: DrugNuiZone[];
    AddUpdateLocation: DrugNuiZone;
    DeleteLocation: number;
    ShowDrugSkill: never;
    ShowDrugTransform: DrugTransformList;
}

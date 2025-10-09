export type DrugContractInfo = any;

export enum DrugSkill {
    Botaniste = 1,
    Zoologiste = 2,
}

export type DrugNuiZone = any;
export type DrugTransformList = any;

export enum DrugType {
    Any = 'any',
}

type DrugConfigType = any;
export const DrugConfigs: Record<DrugType, DrugConfigType> = {
    [DrugType.Any]: {},
};
export const additionalDetectableDrugs: string[] = [];

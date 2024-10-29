export type BlipAction = {
    id: string;
    label: string;
    blipId: string;
};

export interface NuiBlipMethodMap {
    SetActions: BlipAction[];
}

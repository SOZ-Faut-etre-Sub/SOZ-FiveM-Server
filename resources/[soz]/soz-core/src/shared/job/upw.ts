export type UpwFacilityType = 'inverter' | 'plant' | 'resell' | 'terminal';

export type UpwFacility = {
    type: UpwFacilityType;
    identifier: number;
    data: string;
}
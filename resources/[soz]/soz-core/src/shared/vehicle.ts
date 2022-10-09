export type VehicleProperty = 'modEngine' | 'modBrakes' | 'modTransmission' | 'modArmor' | 'modTurbo';

export type VehicleProperties = {
    [key in VehicleProperty]: number;
};

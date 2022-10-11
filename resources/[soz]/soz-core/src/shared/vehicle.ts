export type VehicleProperty = 'modEngine' | 'modBrakes' | 'modTransmission' | 'modArmor' | 'modTurbo';

export type VehicleProperties = {
    [key in VehicleProperty]: number;
};

export type VehicleEntityState = StateBagInterface & {
    id?: number;
    forced?: boolean;
    open?: boolean;
};

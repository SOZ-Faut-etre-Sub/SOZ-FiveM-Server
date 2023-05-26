import { Radio } from '../voip';

export interface NuiRadioMethodMap {
    Open: Radio;
    Update: Radio;
    Close: never;
}

export interface NuiRadioVehicleMethodMap {
    Open: Radio;
    Update: Radio;
}

import { MissiveType } from '@private/shared/missive';
import { Vehicle } from '@public/shared/vehicle/vehicle';

import { Item } from '../item';

export interface NuiMissiveMethodMap {
    ShowMissive: MissiveInfo;
}

export interface MissiveInfo {
    type: MissiveType;
    choice1: number;
    choice2: number;
    choice3: number;
    item?: Item;
    vehicle: Vehicle;
}

import { NamedZone } from '../polyzone/box.zone';

export type UpwFacilityType = 'inverter' | 'plant' | 'resell' | 'terminal';

export type UpwFacility = {
    type: UpwFacilityType;
    identifier: number;
    data: string;
};

export type UpwOrder = {
    uuid: string;
    model: string;
    orderDate: string;
};

const orderZone: NamedZone = {
    name: 'upw_order',
    center: [609.3484, 2759.589, 40.85264],
    length: 1.15,
    width: 2.5,
    minZ: 41.7,
    maxZ: 42.25,
    heading: 365,
    debugPoly: false,
};

export const UpwConfig = {
    Order: {
        zone: orderZone,
        waitingTime: 60, // In minutes
    },
};

export const UPW_CHARGER_REFILL_VALUES: Record<string, number> = {
    ['energy_cell_fossil']: 40,
    ['energy_cell_hydro']: 30,
    ['energy_cell_wind']: 20,
};

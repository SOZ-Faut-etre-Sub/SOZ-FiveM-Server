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
    // Same place of duty
    center: [582.72, 2756.97, 41.86],
    length: 0.4,
    width: 0.3,
    minZ: 42.1,
    maxZ: 42.6,
    heading: 4,
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

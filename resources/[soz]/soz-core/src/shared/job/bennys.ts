import { NamedZone } from '../polyzone/box.zone';
import { getDefaultVehicleConfiguration, VehicleConfiguration } from '../vehicle/modification';

const orderZone: NamedZone = {
    name: 'bennys_order',
    center: [-203.94, -1337.64, 34.89],
    length: 0.15,
    width: 0.55,
    minZ: 34.49,
    maxZ: 35.09,
    heading: 0,
    debugPoly: false,
};

const defaultUpgradeConfiguration: VehicleConfiguration = {
    ...getDefaultVehicleConfiguration(),
    modification: {
        armor: 4,
        brakes: 2,
        engine: 3,
        transmission: 2,
        turbo: true,
    },
};

const resellZone: NamedZone = {
    name: 'bennys_resell',
    center: [260.77, 2578.32, 45.1],
    length: 5.8,
    width: 9.8,
    minZ: 44.1,
    maxZ: 49.1,
    heading: 10,
};

export const BennysConfig = {
    Estimate: {
        duration: 5000,
    },
    UpgradeConfiguration: defaultUpgradeConfiguration,
    Order: {
        zone: orderZone,
        waitingTime: 60, // In minutes
    },
    Resell: {
        zone: resellZone,
    },
};

export type BennysOrder = {
    uuid: string;
    model: string;
    orderDate: string;
};

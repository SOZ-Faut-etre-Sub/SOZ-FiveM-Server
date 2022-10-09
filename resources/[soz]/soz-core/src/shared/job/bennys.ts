import { ZoneOptions } from '../../client/target/target.factory';

const orderZone: ZoneOptions & { name: string } = {
    name: 'bennys_order',
    center: [-203.94, -1337.64, 34.89],
    length: 0.15,
    width: 0.55,
    minZ: 34.49,
    maxZ: 35.09,
    heading: 0,
    debugPoly: false,
};

const upgradedSimplifiedMods = {
    modArmor: 4,
    modBrakes: 2,
    modEngine: 3,
    modTransmission: 2,
    modTurbo: 1,
};

const resellZone: ZoneOptions & { name: string } = {
    name: 'bennys_resell',
    center: [806.84, -3021.32, 5.74],
    length: 10,
    width: 21.6,
    minZ: 34.49,
    maxZ: 35.09,
    heading: 0,
};

export const BennysConfig = {
    Estimate: {
        duration: 5000,
    },
    Mods: {
        upgradedSimplifiedMods,
    },
    Order: {
        zone: orderZone,
    },
    Resell: {
        zone: resellZone,
    },
};

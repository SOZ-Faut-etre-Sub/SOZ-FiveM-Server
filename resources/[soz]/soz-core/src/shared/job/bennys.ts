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

import { AtmType } from '@public/shared/bank';
import { Vector4 } from '@public/shared/polyzone/vector';

import { JobType } from '../shared/job';
import { BoxZone, Zone } from '../shared/polyzone/box.zone';

export const PacificBankZone: BoxZone = new BoxZone([246.43, 223.79, 106.29], 2.0, 15.0, {
    heading: 340,
    minZ: 105.29,
    maxZ: 108.29,
});

export const SafeStorageMaxCapacity = 900_000;
export const HouseSafeStorageTiers = {
    0: 10000,
    1: 20000,
    2: 40000,
    3: 60000,
    4: 100000,
};

export const BankPedLocations: Record<string, Vector4> = {
    pacific1: [243.63, 226.24, 105.29, 158.33],
    pacific2: [247.04, 224.99, 105.29, 157.44],
    pacific3: [252.19, 223.16, 105.29, 160.18],
    fleeca1: [149.42, -1042.15, 28.37, 340.3],
    fleeca2: [313.79, -280.53, 53.16, 341.82],
    fleeca3: [-351.3, -51.3, 48.04, 342.4],
    fleeca4: [-1211.96, -331.94, 36.78, 23.77],
    fleeca5: [-2961.13, 482.98, 14.7, 85.95],
    fleeca6: [1175.01, 2708.3, 37.09, 176.68],
    fleeca7: [-112.26, 6471.04, 30.63, 132.8],
    fleeca8: [5057.64, -5193.98, 1.48, 99.1],
};

export const AtmModels: Record<string, AtmType> = {
    prop_atm_01: AtmType.SMALL,
    soz_prop_atm_01_hs2: AtmType.SMALL,
    prop_atm_02: AtmType.BIG,
    soz_prop_atm_02_hs2: AtmType.BIG,
    prop_atm_03: AtmType.BIG,
    soz_prop_atm_03_hs2: AtmType.BIG,
    prop_fleeca_atm: AtmType.BIG,
    soz_prop_fleeca_atm_hs2: AtmType.BIG,
    soz_atm_entreprise: AtmType.ENTERPRISE,
};

export const AtmConfig: Record<AtmType, { maxMoney: number; maxWithdrawal?: number; limit?: number }> = {
    [AtmType.PACIFIC]: { maxMoney: 6_000_000 },
    [AtmType.FLEECA]: { maxMoney: 500_000, maxWithdrawal: 100_000, limit: 10 * 60 * 1000 },
    [AtmType.BIG]: { maxMoney: 30_000, maxWithdrawal: 10_000, limit: 10 * 60 * 1000 },
    [AtmType.SMALL]: { maxMoney: 15_000, maxWithdrawal: 5_000, limit: 10 * 60 * 1000 },
    [AtmType.ENTERPRISE]: { maxMoney: 30_000, maxWithdrawal: 10_000, limit: 15 * 60 * 1000 },
};

export const FarmAccount: Record<string, { money: number; marked_money?: number }> = {
    bank_refill: { money: 100_000_000 },
    bennys_reseller: { money: 100_000_000 },
    farm_bennys: { money: 300_000 },
    farm_news: { money: 300_000 },
    'farm_you-news': { money: 300_000 },
    farm_stonk: { money: 300_000 },
    farm_mtp: { money: 300_000 },
    farm_garbage: { money: 300_000 },
    farm_taxi: { money: 300_000 },
    farm_food: { money: 300_000 },
    farm_upw: { money: 300_000 },
    farm_pawl: { money: 300_000 },
    farm_baun: { money: 300_000 },
    farm_ffs: { money: 300_000 },
    farm_fdf: { money: 300_000 },
    farm_dmc: { money: 300_000 },
};

export const SocietySafeStorage: Partial<Record<JobType, { label: string; zone: Zone }>> = {
    [JobType.CashTransfer]: {
        label: 'Coffre STONK Security',
        zone: {
            center: [-33.94, -715.14, 40.62],
            length: 1.0,
            width: 3.0,
            heading: 113.9,
            minZ: 39.62,
            maxZ: 41.62,
        },
    },
    [JobType.LSPD]: {
        label: 'Coffre LSPD',
        zone: {
            center: [622.21, -30.71, 90.51],
            length: 1.0,
            width: 2.5,
            heading: 160.0,
            minZ: 89.51,
            maxZ: 91.51,
        },
    },
    [JobType.BCSO]: {
        label: 'Coffre BCSO',
        zone: {
            center: [1855.94, 3690.49, 37.75],
            length: 1.0,
            width: 2.5,
            heading: 120.0,
            minZ: 36.75,
            maxZ: 38.75,
        },
    },
    [JobType.LSMC]: {
        label: 'Coffre LSMC',
        zone: {
            center: [368.9, -1415.68, 38.19],
            length: 0.6,
            width: 0.7,
            heading: 320,
            minZ: 37.04,
            maxZ: 37.99,
        },
    },
    [JobType.News]: {
        label: 'Coffre Twitch News',
        zone: {
            center: [-575.83, -937.5, 28.7],
            length: 1.3,
            width: 2.5,
            minZ: 27.7,
            maxZ: 29.7,
        },
    },
    [JobType.YouNews]: {
        label: 'Coffre You News',
        zone: {
            center: [-1057.23, -234.11, 44.02],
            length: 0.6,
            width: 1.8,
            heading: 117.47,
            minZ: 43.02,
            maxZ: 44.02,
        },
    },
    [JobType.Garbage]: {
        label: 'Coffre BlueBird',
        zone: {
            center: [-623.89, -1616.37, 33.01],
            length: 0.2,
            width: 1.8,
            heading: 354,
            minZ: 32.01,
            maxZ: 34.51,
        },
    },
    [JobType.Taxi]: {
        label: "Coffre Carl'jr",
        zone: {
            center: [907.77, -149.83, 74.17],
            length: 0.4,
            width: 1.4,
            heading: 328,
            minZ: 73.17,
            maxZ: 75.37,
        },
    },
    [JobType.Oil]: {
        label: 'Coffre MTP',
        zone: {
            center: [-246.3, 6064.38, 40.57],
            length: 0.2,
            width: 0.95,
            heading: 315,
            minZ: 40.37,
            maxZ: 41.57,
        },
    },
    [JobType.Bennys]: {
        label: 'Coffre New Gahray',
        zone: {
            center: [-203.8, -1333.11, 34.89],
            length: 1.0,
            width: 1.5,
            minZ: 33.89,
            maxZ: 35.89,
        },
    },
    [JobType.Food]: {
        label: 'Coffre Chateau-Marius',
        zone: {
            center: [-1898.62, 2065.6, 141.0],
            length: 0.8,
            width: 2.2,
            heading: 340,
            minZ: 140.0,
            maxZ: 142.0,
        },
    },
    [JobType.Upw]: {
        label: 'Coffre Unexpected Water & Power',
        zone: {
            center: [602.59, 2760.5, 47.76],
            length: 1.2,
            width: 1.0,
            heading: 4,
            minZ: 46.76,
            maxZ: 48.76,
        },
    },
    [JobType.Pawl]: {
        label: 'Coffre Pipe And Wooden Leg',
        zone: {
            center: [-543.77, 5306.63, 76.37],
            length: 0.75,
            width: 0.3,
            heading: 340,
            minZ: 75.37,
            maxZ: 77.37,
        },
    },
    [JobType.Baun]: {
        label: 'Coffre Bahama Unicorn',
        zone: {
            center: [-1384.84, -631.58, 30.81],
            length: 0.7,
            width: 0.7,
            heading: 303,
            minZ: 26.81,
            maxZ: 30.81,
        },
    },
    [JobType.Ffs]: {
        label: 'Coffre Fight For Style',
        zone: {
            center: [709.57, -966.87, 30.41],
            length: 1.1,
            width: 0.6,
            heading: 0,
            minZ: 30.21,
            maxZ: 30.81,
        },
    },
    [JobType.MDR]: {
        label: 'Coffre Mandatory',
        zone: {
            center: [-546.25, -200.29, 47.66],
            length: 1.0,
            width: 1.0,
            heading: 30.0,
            minZ: 46.66,
            maxZ: 48.66,
        },
    },
    [JobType.SASP]: {
        label: 'Coffre SASP',
        zone: {
            center: [-583.08, -590.96, 34.68],
            length: 1.0,
            width: 0.8,
            heading: 0.0,
            minZ: 33.68,
            maxZ: 35.68,
        },
    },
    [JobType.FDF]: {
        label: 'Coffre Ferme de Fou',
        zone: {
            center: [2436.49, 4964.26, 46.81],
            length: 1.0,
            width: 0.85,
            heading: 43.58,
            minZ: 45.81,
            maxZ: 47.81,
        },
    },
    [JobType.Gouv]: {
        label: 'Coffre Gouvernement',
        zone: {
            center: [-525.62, -590.78, 34.68],
            length: 0.4,
            width: 1.0,
            heading: 0.0,
            minZ: 33.68,
            maxZ: 35.68,
        },
    },
    [JobType.DMC]: {
        label: 'Coffre DeMetal Company',
        zone: {
            center: [1076.19, -2008.55, 32.09],
            length: 1.0,
            width: 2.0,
            heading: 143.57,
            minZ: 31.09,
            maxZ: 33.09,
        },
    },
    [JobType.LSCS]: {
        label: 'Coffre LSCS',
        zone: {
            center: [450.15, -972.49, 30.44],
            length: 1.0,
            width: 1.2,
            heading: 181.33,
            minZ: 29.44,
            maxZ: 31.04,
        },
    },
};

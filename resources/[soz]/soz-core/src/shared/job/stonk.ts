import { ZoneOptions } from '../../client/target/target.factory';

export type StonkBagType = 'jewelbag' | 'small_moneybag' | 'medium_moneybag' | 'big_moneybag';

const resellZones: (ZoneOptions & { bagAccepted: StonkBagType })[] = [
    {
        name: 'Lombank',
        center: [-864.59, -192.82, 37.7],
        length: 0.6,
        width: 6.2,
        heading: 300,
        minZ: 36.7,
        maxZ: 39.65,
        bagAccepted: 'small_moneybag',
    },
    {
        name: 'MAZE_Bank',
        center: [-1381.23, -498.95, 33.16],
        length: 0.4,
        width: 5.4,
        heading: 8,
        minZ: 31.11,
        maxZ: 35.11,
        bagAccepted: 'medium_moneybag',
    },
    {
        name: 'Lombank_HQ',
        center: [-693.44, -581.7, 31.55],
        length: 0.6,
        width: 7.2,
        heading: 0,
        minZ: 29.75,
        maxZ: 33.75,
        bagAccepted: 'big_moneybag',
    },
    {
        name: 'Jewelry_Exchange',
        center: [301.56, -884.64, 29.24],
        length: 0.4,
        width: 4.6,
        heading: 250,
        minZ: 27.44,
        maxZ: 31.44,
        bagAccepted: 'jewelbag',
    },
];

export const StonkConfig = {
    bankAccount: {
        main: 'cash-transfer',
        safe: 'safe_cash-transfer',
        farm: 'farm_stonk',
        bankRefill: 'bank_refill',
    },
    collection: {
        jewelbag: {
            refill_value: null,
            society_gain: 720,
            timeout: 24 * 60 * 60 * 1000,
            takeInAvailableIn: ['jewelry'],
        },
        small_moneybag: {
            refill_value: 6000,
            society_gain: 360,
            timeout: 10 * 60 * 1000,
            takeInAvailableIn: [
                'binco',
                'tattoo',
                'barber',
                '247supermarket-north',
                'ltdgasoline-north',
                'robsliquor-north',
            ],
        },
        medium_moneybag: {
            refill_value: 4000,
            society_gain: 240,
            timeout: 20 * 60 * 1000,
            takeInAvailableIn: [
                'suburban',
                'ammunation',
                '247supermarket-south',
                'ltdgasoline-south',
                'robsliquor-south',
            ],
        },
        big_moneybag: {
            refill_value: 2000,
            society_gain: 120,
            timeout: 30 * 60 * 1000,
            takeInAvailableIn: ['ponsonbys'],
        },
    },
    resell: {
        duration: 5 * 1000,
        amount: 5,
        zones: resellZones,
    },
};

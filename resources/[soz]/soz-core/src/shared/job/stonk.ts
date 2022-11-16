import { NamedZone } from '../polyzone/box.zone';

export type StonkBagType = 'jewelbag' | 'small_moneybag' | 'medium_moneybag' | 'big_moneybag';

const resellZones: (NamedZone & { bagAccepted: StonkBagType })[] = [
    {
        name: 'Lombank',
        center: [-880.35, -194.65, 38.38],
        length: 0.4,
        width: 2.6,
        heading: 295,
        minZ: 37.38,
        maxZ: 40.78,
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

const deliveryZones: NamedZone[] = [
    {
        name: 'BOLINGBROKE PENITENTIARY',
        center: [1845.43, 2585.9, 45.67],
        length: 0.2,
        width: 1.4,
        heading: 270,
        minZ: 43.32,
        maxZ: 47.32,
    },
    {
        name: 'HUMANE LABS & RESEARCH',
        center: [3433.04, 3756.55, 30.5],
        length: 0.4,
        width: 1.6,
        heading: 28,
        minZ: 28.1,
        maxZ: 32.1,
    },
    {
        name: 'LAGO ZANCUDO',
        center: [-2304.24, 3426.83, 31.01],
        length: 0.4,
        width: 1.4,
        heading: 230,
        minZ: 28.66,
        maxZ: 32.66,
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
            society_gain: 960,
            timeout: 24 * 60 * 60 * 1000,
            takeInAvailableIn: ['jewelry'],
        },
        small_moneybag: {
            refill_value: 3000,
            society_gain: 60,
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
            refill_value: 5000,
            society_gain: 120,
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
            refill_value: 8000,
            society_gain: 240,
            timeout: 30 * 60 * 1000,
            takeInAvailableIn: ['ponsonbys'],
        },
    },
    resell: {
        collectionDuration: 15 * 1000,
        duration: 5 * 1000,
        amount: 5,
        zones: resellZones,
    },
    delivery: {
        item: 'stonk__secure_container',
        duration: 45 * 1000,
        society_gain: 6000,
        location: deliveryZones,
    },
};

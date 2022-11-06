import { ShopConfig } from '../shop';

export const BossShop: (ShopConfig & { job: string })[] = [
    {
        name: 'pawl',
        job: 'pawl',
        zone: {
            center: [-538.07, 5304.91, 76.37],
            length: 0.55,
            width: 0.65,
            heading: 340,
            minZ: 75.37,
            maxZ: 77.37,
        },
        targets: [],
        products: [{ id: 'weapon_hatchet', type: 'weapon', price: 100 }],
    },
    {
        name: 'stonk',
        job: 'cash-transfer',
        zone: {
            center: [-15.5, -708.83, 45.02],
            length: 0.6,
            width: 2.6,
            heading: 25,
            minZ: 45.02,
            maxZ: 48.02,
        },
        targets: [],
        products: [
            { id: 'outfit', type: 'item', metadata: { label: 'STONK', type: 'stonk' }, price: 100 },
            { id: 'armor', type: 'item', metadata: { label: 'STONK', type: 'stonk' }, price: 150 },
            { id: 'weapon_pistol', type: 'weapon', price: 300 },
            { id: 'pistol_ammo', type: 'weapon_ammo', price: 10 },
        ],
    },
];

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
            debugPoly: true,
        },
        targets: [],
        products: [{ id: 'weapon_hatchet', type: 'weapon', price: 100 }],
    },
];

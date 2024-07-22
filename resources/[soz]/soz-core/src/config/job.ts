import { Blip } from '../shared/blip';
import { JobType } from '../shared/job';

export const JobBlips: Partial<Record<JobType, Blip[]>> = {
    [JobType.Bennys]: [
        {
            name: 'New Gahray',
            sprite: 227,
            scale: 0.9,
            coords: { x: -211.91, y: -1323.98, z: 30.89 },
        },
        {
            name: 'New Gahray',
            sprite: 227,
            scale: 0.9,
            coords: { x: 1912.15, y: 3082.26, z: 46.92 },
        },
        {
            name: 'Casse',
            sprite: 653,
            scale: 0.9,
            coords: { x: 2405.98, y: 3127.11, z: 48.17 },
        },
        {
            name: 'Atelier Marin',
            sprite: 446,
            scale: 0.9,
            coords: { x: 5111.62, y: -4638.45, z: 1.74 },
        },
    ],
    [JobType.Oil]: [
        {
            name: 'Michel Transport Petrol',
            sprite: 436,
            scale: 0.9,
            coords: { x: -251.75, y: 6099.03, z: 31.39 },
        },
    ],
    // METEOR [JobType.Food]: [
    //     {
    //         name: 'Château Marius',
    //         sprite: 176,
    //         scale: 0.9,
    //         coords: { x: -1889.54, y: 2045.27 },
    //     },
    // ],
};

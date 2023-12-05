import { Prisma } from '@prisma/client';

import { JobType } from '../../src/shared/job';

export const storages: Prisma.fuel_storageCreateManyInput[] = [
    {
        station: 'Station1',
        fuel: 'essence',
        type: 'public',
        stock: 2000,
        price: 1.25,
        position: '{ "x": 49.4187, "y": 2778.793, "z": 58.043 }',
        model: -469694731,
        zone:
            '{\n' +
            '                    "position": {\n' +
            '                        "x": 49.4187,\n' +
            '                        "y": 2778.793,\n' +
            '                        "z": 57.043\n' +
            '                    },\n' +
            '                    "length": 15,\n' +
            '                    "width": 15,\n' +
            '                    "options": {\n' +
            '                        "name": "Fuel1",\n' +
            '                        "heading": 60.0,\n' +
            '                        "minZ": 57.0,\n' +
            '                        "maxZ": 61.0\n' +
            '                    }\n' +
            '                }',
    },
    {
        station: 'BlueBird_car',
        fuel: 'essence',
        type: 'private',
        owner: JobType.Garbage,
        stock: 2000,
        price: 0,
        position: '{"x": -613.58, "y": -1569.11, "z": 25.75, "w": 25.73}',
        model: 1694452750,
        zone:
            '{\n' +
            '                "position": {"x": -610.74, "y": -1575.25, "z": 26.75},\n' +
            '                "length": 22.2,\n' +
            '                "width": 15.0,\n' +
            '                "options": {\n' +
            '                    "name": "BlueBird_car",\n' +
            '                    "heading": 292.0,\n' +
            '                    "minZ": 25.75,\n' +
            '                    "maxZ": 28.75\n' +
            '                }\n' +
            '            }',
    },
];

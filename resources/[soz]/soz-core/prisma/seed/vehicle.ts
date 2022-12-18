import { Prisma } from '@prisma/client';

import { joaat } from '../../src/shared/joaat';
import { JobType } from '../../src/shared/job';
import { getRandomInt } from '../../src/shared/random';

const baseList = [
    ['asea', 'Asea', 'Sedans', 'pdm', 'car'],
    ['akuma', 'Akuma', 'Motorcycles', 'moto', 'motorcycle'],
    ['alpha', 'Alpha', 'Sports', 'luxury', 'car'],
    ['carbonizzare', 'Carbonizzare', 'Sports', 'luxury', 'car'],
    ['buzzard2', 'Buzzard', 'Helicopters', 'air', 'heli'],
    ['bmx', 'BMX', 'Cycles', 'cycle', null],
];

const vehicleJobList: [[string, string, number]] = [[JobType.Bennys, 'flatbed4', 1]];
export const vehicles: Prisma.VehicleCreateManyInput[] = [];
baseList.forEach(vehicle => {
    vehicles.push({
        model: vehicle[0],
        hash: joaat(vehicle[0]),
        name: vehicle[1],
        price: getRandomInt(10000, 1000000),
        category: vehicle[2],
        dealershipId: vehicle[3],
        requiredLicence: vehicle[4],
        size: 1,
        stock: getRandomInt(1, 10),
    });
});

vehicleJobList.forEach(vehicle => {
    vehicles.push({
        model: vehicle[1],
        hash: joaat(vehicle[1]),
        name: vehicle[1],
        price: getRandomInt(10000, 1000000),
        category: 'Job',
        dealershipId: 'job',
        requiredLicence: null,
        size: 1,
        stock: getRandomInt(1, 10),
    });
});

export const dealership_job: Prisma.concess_entrepriseCreateManyInput[] = [];

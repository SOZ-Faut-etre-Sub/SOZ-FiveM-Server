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

const vehicleJobList: [JobType, string, number][] = [
    [JobType.Baun, 'youga3', 1],
    [JobType.BCSO, 'sheriff3', 0],
    [JobType.BCSO, 'sheriff4', 0],
    [JobType.BCSO, 'sheriffb', 0],
    // [JobType.Bennys, 'flatbed4', 1],
    [JobType.Bennys, 'burrito6', 1],
    [JobType.CashTransfer, 'stockade', 0],
    [JobType.CashTransfer, 'baller8', 1],
    [JobType.FBI, 'paragonfbi', 0],
    [JobType.FBI, 'fbi', 0],
    [JobType.FBI, 'cogfbi', 0],
    [JobType.Ffs, 'rumpo4', 1],
    [JobType.Food, 'mule6', 1],
    [JobType.Food, 'sadler1', 2],
    [JobType.Food, 'taco1', 1],
    [JobType.Garbage, 'trash', 0],
    [JobType.LSMC, 'ambulance', 0],
    [JobType.LSMC, 'ambcar', 0],
    [JobType.LSMC, 'firetruk', 1],
    [JobType.LSPD, 'police5', 0],
    [JobType.LSPD, 'police6', 0],
    [JobType.LSPD, 'policeb2', 0],
    [JobType.News, 'newsvan', 1],
    [JobType.News, 'frogger3', 1],
    [JobType.Oil, 'packer2', 1],
    [JobType.Oil, 'utillitruck4', 1],
    [JobType.Oil, 'tanker', 0],
    [JobType.Pawl, 'sadler1', 1],
    [JobType.Pawl, 'hauler1', 1],
    [JobType.Pawl, 'trailerlogs', 1],
    [JobType.Taxi, 'dynasty2', 1],
    [JobType.Upw, 'brickade1', 1],
    [JobType.Upw, 'boxville', 1],
];
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

export const dealership_job: Prisma.concess_entrepriseCreateManyInput[] = [];

vehicleJobList.forEach(vehicle => {
    const price = getRandomInt(10000, 1000000);

    vehicles.push({
        model: vehicle[1],
        hash: joaat(vehicle[1]),
        name: vehicle[1],
        price,
        category: 'Job',
        dealershipId: 'job',
        requiredLicence: 'car',
        size: 1,
        stock: getRandomInt(1, 10),
    });

    dealership_job.push({
        job: vehicle[0],
        vehicle: vehicle[1],
        price,
        category: 'car',
        liverytype: vehicle[2],
    });
});

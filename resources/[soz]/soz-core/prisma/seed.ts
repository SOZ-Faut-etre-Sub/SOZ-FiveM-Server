import { PrismaClient } from '@prisma/client';

import { storages } from './seed/fuel_storage';
import { grades } from './seed/job';
import { facilities } from './seed/upw_facility';
import { dealership_job, vehicles } from './seed/vehicle';

const prisma = new PrismaClient();

async function main() {
    await prisma.vehicle.createMany({
        data: vehicles,
        skipDuplicates: true,
    });
    await prisma.concess_entreprise.createMany({
        data: dealership_job,
        skipDuplicates: true,
    });
    await prisma.job_grades.createMany({
        data: grades,
    });
    await prisma.fuel_storage.createMany({
        data: storages,
    });
    await prisma.upw_facility.createMany({
        data: facilities,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);

        await prisma.$disconnect();

        process.exit(1);
    });

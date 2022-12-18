import { Prisma } from '@prisma/client';

import { JobType } from '../../src/shared/job';

const TemporaryJob = [JobType.Adsl, JobType.Delivery, JobType.Religious, JobType.Scrapper];

export const grades: Prisma.job_gradesCreateManyInput[] = [
    {
        jobId: 'unemployed',
        name: 'Unemployed',
        weight: 0,
        salary: 0,
        owner: 0,
        is_default: 1,
        permissions: '[]',
    },
];

for (const job of TemporaryJob) {
    grades.push({
        jobId: job,
        name: 'Intérimaire',
        weight: 0,
        salary: 0,
        owner: 0,
        is_default: 1,
        permissions: '[]',
    });
}

for (const job of Object.values(JobType)) {
    if (TemporaryJob.includes(job)) continue;

    grades.push({
        jobId: job,
        name: 'Patron',
        weight: 10,
        salary: 276,
        owner: 1,
        is_default: 0,
        permissions: '[]',
    });

    grades.push({
        jobId: job,
        name: 'Employé',
        weight: 1,
        salary: 105,
        owner: 0,
        is_default: 1,
        permissions: '[]',
    });
}

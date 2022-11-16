import { Blip } from '../shared/blip';
import { JobCloakroomZoneData, JobType } from '../shared/job';
import { Zone } from '../shared/polyzone/box.zone';

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
    ],
};

export const JobCloakrooms: Partial<Record<JobType, Zone<JobCloakroomZoneData>[]>> = {
    [JobType.Baun]: [
        {
            center: [106.36, -1299.08, 28.77],
            length: 0.4,
            width: 2.3,
            minZ: 27.82,
            maxZ: 30.27,
            heading: 30,
            data: {
                id: 'jobs:baun:cloakroom:unicorn_1',
                event: 'jobs:client:baun:OpenCloakroomMenu', // Tech debt as it's not homogeneous
                job: JobType.Baun,
                storage: 'baun_unicorn_cloakroom_1',
            },
        },
        {
            center: [109.05, -1304.24, 28.77],
            length: 2.25,
            width: 0.4,
            minZ: 27.87,
            maxZ: 30.27,
            heading: 30,
            data: {
                id: 'jobs:baun:cloakroom:unicorn_2',
                event: 'jobs:client:baun:OpenCloakroomMenu', // Tech debt as it's not homogeneous
                job: JobType.Baun,
                storage: 'baun_unicorn_cloakroom_2',
            },
        },
        {
            center: [-1381.38, -602.26, 30.32],
            length: 2.0,
            width: 6.4,
            minZ: 29.92,
            maxZ: 31.92,
            heading: 303,
            data: {
                id: 'jobs:baun:cloakroom:bahama_1',
                event: 'jobs:client:baun:OpenCloakroomMenu', // Tech debt as it's not homogeneous
                job: JobType.Baun,
                storage: 'baun_bahama_cloakroom_1',
            },
        },
    ],
    [JobType.Ffs]: [
        {
            center: [706.41, -959.03, 30.4],
            length: 0.5,
            width: 4.25,
            minZ: 29.4,
            maxZ: 31.6,
            heading: 0,
            data: {
                id: 'jobs:ffs:cloakroom',
                event: 'jobs:client:ffs:OpenCloakroomMenu', // Tech debt as it's not homogeneous
                job: JobType.Ffs,
                storage: 'ffs_cloakroom',
            },
        },
    ],
};

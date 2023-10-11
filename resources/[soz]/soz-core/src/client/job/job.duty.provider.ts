import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { JobPermission, JobType } from '../../shared/job';
import { Zone } from '../../shared/polyzone/box.zone';
import { PlayerService } from '../player/player.service';
import { TargetFactory, TargetOptions } from '../target/target.factory';
import { JobService } from './job.service';

const DutyZoneConfig: Zone<JobType>[] = [
    {
        data: JobType.News,
        center: [-587.75, -934.67, 23.82],
        length: 0.4,
        width: 0.8,
        heading: 32,
        minZ: 23.72,
        maxZ: 24.32,
    },
    {
        data: JobType.YouNews,
        center: [-1080.13, -244.47, 44.02],
        length: 1.2,
        width: 1.8,
        heading: 207.83,
        minZ: 43.02,
        maxZ: 45.02,
    },
    {
        data: JobType.Ffs,
        center: [707.29, -967.58, 30.41],
        length: 0.35,
        width: 0.4,
        minZ: 30.21,
        maxZ: 30.66,
    },
    {
        data: JobType.Bennys,
        center: [1908.09, 3090.02, 46.93],
        length: 2.8,
        width: 0.8,
        heading: 330.0,
        minZ: 45.93,
        maxZ: 46.932,
    },
    {
        data: JobType.Gouv,
        center: [-547.61, -611.22, 34.68],
        length: 0.6,
        width: 0.4,
        minZ: 33.68,
        maxZ: 35.68,
        heading: 270,
    },
    {
        data: JobType.LSMC,
        center: [356.62, -1417.61, 32.51],
        length: 0.65,
        width: 0.5,
        minZ: 32.41,
        maxZ: 32.61,
        heading: 325,
    },
    {
        data: JobType.MDR,
        center: [-553.85, -185.33, 38.22],
        length: 1.0,
        width: 1.0,
        minZ: 37.22,
        maxZ: 40.22,
    },
    {
        data: JobType.Taxi,
        center: [903.31, -157.89, 74.17],
        length: 1.0,
        width: 0.4,
        minZ: 73.97,
        maxZ: 74.77,
        heading: 328,
    },
    {
        data: JobType.Garbage,
        center: [-615.5, -1622.18, 33.01],
        length: 0.6,
        width: 0.6,
        minZ: 32.7,
        maxZ: 33.3,
        heading: 59,
    },
    {
        data: JobType.Oil,
        center: [-230.65, 6088.05, 31.39],
        length: 0.1,
        width: 3.1,
        minZ: 30.39,
        maxZ: 33.39,
        heading: 315,
    },
    {
        data: JobType.CashTransfer,
        center: [-18.74, -707.44, 46.2],
        length: 0.2,
        width: 0.5,
        minZ: 45.9,
        maxZ: 46.45,
        heading: 200,
    },
    {
        data: JobType.Food,
        center: [-1876.2, 2059.5, 141.0],
        length: 0.6,
        width: 0.7,
        minZ: 140.75,
        maxZ: 141.5,
        heading: 70.25,
    },
    {
        data: JobType.Baun,
        center: [-1388.11, -606.23, 30.32],
        length: 0.55,
        width: 0.55,
        minZ: 30.32,
        maxZ: 30.87,
        heading: 16,
    },
    {
        data: JobType.Baun,
        center: [133.53, -1286.86, 29.27],
        length: 0.45,
        width: 0.5,
        minZ: 29.27,
        maxZ: 29.67,
        heading: 345,
    },
    {
        data: JobType.Baun,
        center: [1981.85, 3053.75, 47.22],
        length: 0.6,
        width: 0.4,
        minZ: 47.12,
        maxZ: 47.62,
        heading: 58.15,
    },
    {
        data: JobType.FDF,
        center: [2437.28, 4964.28, 47.21],
        heading: 45,
        length: 0.2,
        width: 1.8,
        minZ: 47.01,
        maxZ: 48.21,
    },
    {
        data: JobType.DMC,
        center: [1078.86, -1974.87, 31.47],
        length: 0.4,
        width: 1.2,
        minZ: 31.07,
        maxZ: 32.47,
        heading: 324.53,
    },
    {
        data: JobType.Upw,
        center: [582.72, 2756.97, 41.86],
        length: 0.4,
        width: 0.3,
        minZ: 42.1,
        maxZ: 42.6,
        heading: 4,
    },
    {
        data: JobType.SASP,
        center: [-563.57, -611.13, 34.68],
        length: 0.6,
        width: 1.0,
        minZ: 33.68,
        maxZ: 35.68,
        heading: 0.0,
    },
    {
        data: JobType.LSPD,
        center: [615.900574, 15.299749, 82.797417],
        length: 0.45,
        width: 0.35,
        minZ: 82.697417,
        maxZ: 82.897417,
        heading: 58,
    },
    {
        data: JobType.LSPD,
        center: [580.91, -29.72, 76.63],
        length: 0.6,
        width: 9.0,
        minZ: 75.63,
        maxZ: 78.637,
        heading: 350,
    },
    {
        data: JobType.BCSO,
        center: [1853.753052, 3688.094727, 35.412041],
        length: 0.47,
        width: 0.47,
        minZ: 34.2,
        maxZ: 34.8,
        heading: 65,
    },
    {
        data: JobType.BCSO,
        center: [1864.93, 3681.1, 30.27],
        length: 1.0,
        width: 7.8,
        minZ: 29.27,
        maxZ: 32.27,
        heading: 30,
    },
    {
        data: JobType.Pawl,
        center: [-539.36, 5305.28, 76.37],
        length: 0.4,
        width: 1.2,
        minZ: 76.12,
        maxZ: 76.77,
        heading: 340,
    },
];

const DutyPedConfig: Partial<Record<JobType, number>> = {
    [JobType.Bennys]: -1830645735,
};

@Provider()
export class JobDutyProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Once(OnceStep.PlayerLoaded)
    public async onDutyLoad() {
        let i = 0;

        for (const duty of DutyZoneConfig) {
            this.targetFactory.createForBoxZone(`job:duty:${duty.data}:${i}`, duty, this.getDutyZoneTarget(duty.data));

            i++;
        }

        for (const [job, ped] of Object.entries(DutyPedConfig)) {
            this.targetFactory.createForModel(ped, this.getDutyZoneTarget(job as JobType));
        }
    }

    getDutyZoneTarget(job: JobType): TargetOptions[] {
        return [
            {
                type: 'server',
                event: 'QBCore:ToggleDuty',
                icon: 'fas fa-sign-in-alt',
                label: 'Prise de service',
                canInteract: () => {
                    return !this.playerService.isOnDuty();
                },
                job,
            },
            {
                type: 'server',
                event: 'QBCore:ToggleDuty',
                icon: 'fas fa-sign-in-alt',
                label: 'Fin de service',
                canInteract: () => {
                    return this.playerService.isOnDuty();
                },
                job,
            },
            {
                icon: 'fas fa-users',
                label: 'Employé(e)s en service',
                action: () => {
                    TriggerServerEvent('QBCore:GetEmployOnDuty');
                },
                canInteract: () => {
                    const player = this.playerService.getPlayer();
                    return (
                        this.playerService.isOnDuty() &&
                        this.jobService.hasPermission(player.job.id, JobPermission.OnDutyView)
                    );
                },
                job,
            },
        ];
    }
}

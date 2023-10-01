import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { JobPermission, JobType } from '../../shared/job';
import { Zone } from '../../shared/polyzone/box.zone';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';
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
        center: [-587.75, -934.67, 23.82], // @TODO News
        length: 0.4,
        width: 0.8,
        heading: 32,
        minZ: 23.72,
        maxZ: 24.32,
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
        for (const duty of DutyZoneConfig) {
            this.targetFactory.createForBoxZone(`job:duty:${duty.data}`, duty, [
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Prise de service',
                    canInteract: () => {
                        return !this.playerService.isOnDuty();
                    },
                    job: duty.data,
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: duty.data,
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
                    job: duty.data,
                },
            ]);
        }

        for (const [job, ped] of Object.entries(DutyPedConfig)) {
            this.targetFactory.createForModel(ped, [
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
            ]);
        }
    }
}

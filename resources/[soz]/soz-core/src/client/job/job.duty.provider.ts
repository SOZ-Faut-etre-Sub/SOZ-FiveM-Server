import { Feature } from '@public/shared/features';
import { Bunkers } from '@public/shared/utils/bunkers';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { JobPermission, JobType } from '../../shared/job';
import { Zone } from '../../shared/polyzone/box.zone';
import { TargetOption } from '../../shared/target';
import { FeatureProvider } from '../feature/feature.provider';
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
        center: [1907.77, 3089.4, 46.13],
        length: 0.6,
        width: 1.2,
        heading: 58.27,
        minZ: 46.73,
        maxZ: 47.13,
    },
    {
        data: JobType.Bennys,
        center: [-203.34, -1337.55, 34.89],
        length: 0.6,
        width: 0.35,
        heading: -3.1,
        minZ: 34.49,
        maxZ: 35.29,
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
        center: [360.98, -1420.47, 32.36],
        length: 0.4,
        width: 0.6,
        minZ: 32.36,
        maxZ: 32.56,
        heading: 95.11,
    },
    {
        data: JobType.LSMC,
        center: [1826.49, 3671.89, 34.28],
        length: 0.4,
        width: 0.6,
        minZ: 34.08,
        maxZ: 34.48,
        heading: 143.52,
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
        data: JobType.MDR,
        center: [243.42, -1091.71, 30.19],
        length: 0.6,
        width: 3.2,
        minZ: 29.19,
        maxZ: 29.74,
        heading: 179.79,
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
        center: [-1867.11, 2063.59, 141.57],
        length: 3.0,
        width: 0.4,
        heading: 89.05,
        minZ: 140.97,
        maxZ: 142.17,
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
    // Vinewood
    {
        data: JobType.LSPD,
        center: [615.900574, 15.299749, 82.797417],
        length: 0.45,
        width: 0.35,
        minZ: 82.697417,
        maxZ: 82.897417,
        heading: 58,
    },
    // Mission Row
    {
        data: JobType.LSPD,
        center: [441.9, -979.64, 31.34],
        length: 0.8,
        width: 1.4,
        minZ: 30.34,
        maxZ: 30.94,
        heading: -0.41,
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
        data: JobType.Pawl,
        center: [-539.36, 5305.28, 76.37],
        length: 0.4,
        width: 1.2,
        minZ: 76.12,
        maxZ: 76.77,
        heading: 340,
    },
    {
        data: JobType.LSCS,
        center: [441.04, -980.12, 30.79],
        length: 0.35,
        width: 0.6,
        minZ: 30.59,
        maxZ: 30.99,
        heading: 159.31,
    },
    {
        data: JobType.LSCS,
        center: [1132.37, -490.36, 65.16],
        length: 0.8,
        width: 1.8,
        heading: 151.27,
        minZ: 64.16,
        maxZ: 66.16,
    },

    // MIRROR PARK
    {
        data: JobType.LSPD,
        center: [1132.37, -490.36, 65.16],
        length: 0.8,
        width: 1.8,
        heading: 151.27,
        minZ: 64.16,
        maxZ: 66.16,
    },
    // {
    //     data: JobType.BCSO,
    //     center: [1132.37, -490.36, 65.16],
    //     length: 0.8,
    //     width: 1.8,
    //     heading: 151.27,
    //     minZ: 64.16,
    //     maxZ: 66.16,
    // },
    // {
    //     data: JobType.SASP,
    //     center: [1132.37, -490.36, 65.16],
    //     length: 0.8,
    //     width: 1.8,
    //     heading: 151.27,
    //     minZ: 64.16,
    //     maxZ: 66.16,
    // },
    {
        data: JobType.Casino,
        center: [960.09, 34.8, 72.69],
        length: 0.6,
        width: 2.8,
        heading: 147.8,
        minZ: 71.69,
        maxZ: 72.29,
    },
];

const DutyZoneConfigWhatIf: Zone<JobType>[] = [
    {
        data: JobType.SASP,
        center: [615.900574, 15.299749, 82.797417],
        length: 0.45,
        width: 0.35,
        minZ: 82.697417,
        maxZ: 82.897417,
        heading: 58,
    },
];

const BunkerDutyZone = ['xm_prop_base_staff_desk_01', 'v_corp_officedesk'];

const DutyPedConfig: Partial<Record<JobType, number>> = {};

@Provider()
export class JobDutyProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Once(OnceStep.PlayerLoaded)
    public async onDutyLoad() {
        let i = 0;

        for (let duty of DutyZoneConfig) {
            if (this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
                const override = DutyZoneConfigWhatIf.find(elem => elem.data == duty.data);
                if (override) {
                    duty = override;
                }
            }

            this.targetFactory.createForBoxZone(`job:duty:${duty.data}:${i}`, duty, this.getDutyZoneTarget(duty.data));

            i++;
        }

        for (const [job, ped] of Object.entries(DutyPedConfig)) {
            this.targetFactory.createForModel(ped, this.getDutyZoneTarget(job as JobType));
        }

        for (const model of BunkerDutyZone) {
            this.targetFactory.createForModel(model, this.getBunkerDutyZoneTarget());
        }
    }

    getDutyZoneTarget(job: JobType): TargetOption[] {
        return [
            {
                icon: 'jobs/duty',
                label: 'Prise de service',
                category: 'society',
                canInteract: () => {
                    const player = this.playerService.getPlayer();
                    return player.job.id == job && !player.job.onduty;
                },
                action: () => {
                    TriggerServerEvent('QBCore:ToggleDuty');
                },
            },
            {
                icon: 'jobs/duty',
                label: 'Fin de service',
                category: 'society',
                action: () => {
                    TriggerServerEvent('QBCore:ToggleDuty');
                },
                job,
            },
            {
                icon: 'global/users',
                label: 'Employé(e)s en service',
                category: 'society',
                canInteract: () => {
                    const player = this.playerService.getPlayer();
                    return this.jobService.hasPermission(player.job.id, JobPermission.OnDutyView);
                },
                action: () => {
                    TriggerServerEvent('QBCore:GetEmployOnDuty');
                },
                job,
            },
        ];
    }

    getBunkerDutyZoneTarget(): TargetOption[] {
        return [
            {
                icon: 'jobs/duty',
                label: 'Prise de service',
                category: 'society',
                canInteract: () => {
                    const player = this.playerService.getPlayer();
                    if (!player || player.job.id == JobType.Food) {
                        return;
                    }

                    const intId = GetInteriorFromEntity(PlayerPedId());

                    if (!Bunkers.map(b => b.interiorId).includes(intId)) {
                        return false;
                    }
                    return !player.job.onduty;
                },
                action: () => {
                    TriggerServerEvent('QBCore:ToggleDuty');
                },
            },
        ];
    }
}

import { Feature } from '@public/shared/features';

import { JobBlips } from '../../config/job';
import { Once, OnceStep } from '../../core/decorators/event';
import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { Job, JobPermission, JobType } from '../../shared/job';
import { MenuType } from '../../shared/nui/menu';
import { BlipFactory } from '../blip';
import { FeatureProvider } from '../feature/feature.provider';
import { NuiMenu } from '../nui/nui.menu';
import { JobService } from './job.service';

@Provider()
export class JobProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Once(OnceStep.Start)
    public async onStart() {
        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
            return;
        }

        for (const [job, blips] of Object.entries(JobBlips)) {
            for (const blipIndex in blips) {
                const blip = blips[blipIndex];
                this.blipFactory.create(`job_${job}_${blipIndex}`, blip);
            }
        }
    }

    @OnEvent(ClientEvent.JOB_OPEN_ON_DUTY_MENU)
    public async openOnDutyMenu(player_names: string[], job: JobType) {
        this.nuiMenu.openMenu(MenuType.JobOnDutyMenu, {
            state: player_names,
            job: job,
        });
    }

    @Exportable('HasJobPermission')
    public hasJobPermission(targetJob: JobType, permission: JobPermission): boolean {
        return this.jobService.hasPermission(targetJob, permission);
    }

    @Exportable('GetJobs')
    public getJobs(): Job[] {
        return this.jobService.getJobs();
    }

    @Exportable('GetJob')
    public getJob(jobId: JobType): Job {
        return this.jobService.getJob(jobId);
    }
}

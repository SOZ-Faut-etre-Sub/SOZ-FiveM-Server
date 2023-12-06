import { JobBlips } from '../../config/job';
import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { Job, JobPermission, JobType } from '../../shared/job';
import { MenuType } from '../../shared/nui/menu';
import { Ok } from '../../shared/result';
import { BlipFactory } from '../blip';
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

    @Once(OnceStep.Start)
    public async onStart() {
        for (const [job, blips] of Object.entries(JobBlips)) {
            for (const blipIndex in blips) {
                const blip = blips[blipIndex];
                this.blipFactory.create(`job_${job}_${blipIndex}`, blip);
            }
        }
    }

    @OnNuiEvent(NuiEvent.JobPlaceProps)
    public async onPlaceProps(props: { item: string; props: string; offset: number }) {
        if (props.item == 'spike') {
            TriggerServerEvent(ServerEvent.POLICE_PLACE_SPIKE, props.item);
        } else {
            TriggerServerEvent(ServerEvent.JOBS_PLACE_PROPS, props.item, props.props, 0, props.offset);
        }
        return Ok(true);
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

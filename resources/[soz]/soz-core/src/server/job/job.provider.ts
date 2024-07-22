import { OnEvent } from '@public/core/decorators/event';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ServerEvent } from '@public/shared/event';
import { Job, JobPermission, JobType } from '@public/shared/job';

import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { toVector3Object, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { JobService } from '../job.service';
import { Monitor } from '../monitor/monitor';

@Provider()
export class JobProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(JobService)
    private jobService: JobService;

    @Rpc(RpcServerEvent.JOBS_USE_WORK_CLOTHES)
    public async useWorkClothes(source: number, storageId: string) {
        const inventory = await this.inventoryFactory.get(storageId);

        if (!inventory) {
            return;
        }

        return inventory.remove('work_clothes', 1);
    }

    @OnEvent(ServerEvent.QBCORE_SET_DUTY, false)
    public onToggleDuty(jobid: JobType, onDuty: boolean, source: number) {
        this.monitor.traceEvent(onDuty ? 'job_onduty' : 'job_offduty', {
            player_source: source,
            position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
        });
    }

    @Exportable('HasJobPermission')
    public hasJobPermission(targetJobId: JobType, jobId: JobType, gradeId: number, permission: JobPermission) {
        return this.jobService.hasTargetJobPermission(targetJobId, jobId, gradeId, permission);
    }

    @Exportable('GetJobs')
    public getJobs(): Record<JobType, Job> {
        return this.jobService.getJobs();
    }

    @Exportable('GetJob')
    public getJob(jobId: JobType): Job | null {
        return this.jobService.getJob(jobId);
    }
}

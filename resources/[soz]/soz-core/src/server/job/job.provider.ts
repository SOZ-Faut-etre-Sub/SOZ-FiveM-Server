import { OnEvent } from '@public/core/decorators/event';
import { ServerEvent } from '@public/shared/event';
import { Job, JobPermission, JobType } from '@public/shared/job';

import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { toVector3Object, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { InventoryManager } from '../inventory/inventory.manager';
import { JobService } from '../job.service';
import { Monitor } from '../monitor/monitor';

@Provider()
export class JobProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(JobService)
    private jobService: JobService;

    @Rpc(RpcServerEvent.JOBS_USE_WORK_CLOTHES)
    public async useWorkClothes(source: number, storageId: string) {
        return this.inventoryManager.removeItemFromInventory(storageId, 'work_clothes', 1);
    }

    @OnEvent(ServerEvent.QBCORE_SET_DUTY, false)
    public onToggleDuty(jobid: JobType, onDuty: boolean, source: number) {
        this.monitor.publish(
            onDuty ? 'job_onduty' : 'job_offduty',
            {
                player_source: source,
            },
            {
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
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

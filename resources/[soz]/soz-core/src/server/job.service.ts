import { Injectable } from '../core/decorators/injectable';
import { Job, JobPermission, JobType } from '../shared/job';
import { PlayerData } from '../shared/player';

@Injectable()
export class JobService {
    private SozJobCore;

    public constructor() {
        this.SozJobCore = exports['soz-jobs'].GetCoreObject();
    }

    public hasPermission(player: PlayerData, job: JobType, permission: JobPermission): boolean {
        return this.SozJobCore.Functions.HasPermission(job, player.job.id, player.job.grade, permission);
    }

    public getJobs(): Record<JobType, Job> {
        return this.SozJobCore.Jobs as { [key in JobType]: Job };
    }

    public getJob(jobId: string): Job | null {
        const jobs = this.SozJobCore.Jobs as { [key in JobType]: Job };

        if (!jobs) {
            return null;
        }

        return jobs[jobId] || null;
    }
}

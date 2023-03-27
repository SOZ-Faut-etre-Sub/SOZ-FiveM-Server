import { Injectable } from '@core/decorators/injectable';

import { Job, JobPermission, JobType } from '../../shared/job';

@Injectable()
export class JobService {
    private SozJobCore;

    public constructor() {
        this.SozJobCore = exports['soz-jobs'].GetCoreObject();
    }

    public getJobs(): Job[] {
        const jobs = this.SozJobCore.Jobs as { [key in JobType]: Job };
        if (!jobs) {
            return [];
        }
        return Object.entries(jobs)
            .sort((a, b) => a[1].label.localeCompare(b[1].label))
            .map(([key, value]) => ({ ...value, id: key as JobType }));
    }

    public hasPermission(job: string, permission: JobPermission): boolean {
        return this.SozJobCore.Functions.HasPermission(job, permission);
    }

    public getJob(jobId: string): Job | null {
        const jobs = this.SozJobCore.Jobs as { [key in JobType]: Job };

        if (!jobs) {
            return null;
        }

        return jobs[jobId] || null;
    }
}

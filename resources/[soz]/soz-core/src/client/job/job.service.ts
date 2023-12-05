import { Injectable } from '@core/decorators/injectable';

import { Job, JobPermission, JobType } from '../../shared/job';

@Injectable()
export class JobService {
    private SozJobCore;

    public constructor() {
        this.SozJobCore = exports['soz-jobs'].GetCoreObject();
    }

    public getJobs(): Job[] {
        const jobs = this.getJobsFromSozJobCore();
        if (!jobs) {
            return [];
        }
        return Object.entries(jobs)
            .sort((a, b) => a[1].label.localeCompare(b[1].label))
            .map(([key, value]) => ({
                ...value,
                id: key as JobType,
                grades: Array.isArray(value.grades) ? value.grades : Object.values(value.grades),
            }));
    }

    public hasPermission(job: string, permission: JobPermission): boolean {
        return this.SozJobCore.Functions.HasPermission(job, permission);
    }

    public getJob(jobId: string): Job | null {
        const jobs = this.getJobsFromSozJobCore();

        if (!jobs) {
            return null;
        }

        const job = jobs[jobId] || null;

        if (job && !Array.isArray(job.grades)) {
            job.grades = Object.values(job.grades);
        }

        return job;
    }

    private getJobsFromSozJobCore(): { [key in JobType]: Job } {
        return exports['soz-jobs'].GetCoreObject().Jobs;
    }
}

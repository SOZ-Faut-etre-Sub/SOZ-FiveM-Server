import { Inject, Injectable } from '@core/decorators/injectable';
import { JobGradeRepository } from '@public/server/repository/job.grade.repository';
import { JobRegistry } from '@public/shared/job/config';

import { Job, JobPermission, JobType } from '../shared/job';
import { PlayerData } from '../shared/player';

@Injectable()
export class JobService {
    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    public async hasPermissions(player: PlayerData, targetJob: JobType, permissions: JobPermission[]) {
        for (const permission of permissions) {
            if (!(await this.hasPermission(player, targetJob, permission))) {
                return false;
            }
        }

        return true;
    }

    public async hasTargetJobPermission(
        targetJobId: JobType,
        jobId: JobType,
        gradeId: number,
        permission: JobPermission
    ): Promise<boolean> {
        if (targetJobId !== jobId) {
            return false;
        }

        const grade = await this.jobGradeRepository.find(gradeId);

        if (!grade) {
            return false;
        }

        if (grade.owner) {
            return true;
        }

        if (grade.permissions && grade.permissions.includes(permission)) {
            return true;
        }

        return false;
    }

    public async hasPermission(player: PlayerData, targetJob: JobType, permission: JobPermission) {
        return this.hasTargetJobPermission(targetJob, player.job.id, Number(player.job.grade), permission);
    }

    public getJobs(): Record<JobType, Job> {
        const jobs = {};

        for (const jobType of Object.keys(JobRegistry)) {
            const job = JobRegistry[jobType];

            jobs[jobType] = {
                ...job,
                id: jobType as JobType,
            };
        }

        return jobs as Record<JobType, Job>;
    }

    public getJob(jobId: JobType): Job | null {
        return this.getJobs()[jobId] || null;
    }
}

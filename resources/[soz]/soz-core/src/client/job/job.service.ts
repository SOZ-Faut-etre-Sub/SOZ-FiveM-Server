import { Inject, Injectable } from '@core/decorators/injectable';
import { PlayerService } from '@public/client/player/player.service';
import { JobGradeRepository } from '@public/client/repository/job.grade.repository';
import { Job, JobPermission, JobType } from '@public/shared/job';
import { JobRegistry } from '@public/shared/job/config';

@Injectable()
export class JobService {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    public getJobs(): Job[] {
        const jobs = this.getJobsFromRegistry();

        if (!jobs) {
            return [];
        }

        return Object.values(jobs);
    }

    public getJob(jobId: JobType): Job | null {
        const jobs = this.getJobsFromRegistry();

        if (!jobs) {
            return null;
        }

        return jobs[jobId] || null;
    }

    private getJobsFromRegistry(): Record<JobType, Job> {
        const jobs = {};

        for (const jobType of Object.keys(JobRegistry)) {
            const job = JobRegistry[jobType];
            jobs[jobType] = {
                id: jobType,
                ...job,
            };
        }

        return jobs as Record<JobType, Job>;
    }

    public hasPermission(targetJob: JobType, permission: JobPermission): boolean {
        const player = this.playerService.getPlayer();

        if (!player) {
            return false;
        }

        if (targetJob !== player.job.id) {
            return false;
        }

        const grade = this.jobGradeRepository.find(Number(player.job.grade));

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
}

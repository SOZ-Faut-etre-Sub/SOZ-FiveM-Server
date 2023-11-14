import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Job } from '../../shared/job';
import { JobRegistry } from '../../shared/job/config';
import { Ok } from '../../shared/result';
import { Notifier } from '../notifier';
import { JobGradeRepository } from '../repository/job.grade.repository';

@Provider()
export class AdminMenuJobProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @OnNuiEvent(NuiEvent.AdminGetJobGrades)
    public async getJobGrades() {
        const grades = this.jobGradeRepository.get();

        return Ok(grades);
    }

    @OnNuiEvent(NuiEvent.AdminSetJob)
    public async setJob({ jobId, jobGrade }: { jobId: Job['id']; jobGrade?: number }): Promise<void> {
        if (!jobGrade) {
            const grades = this.jobGradeRepository.getGradesByJob(jobId);
            jobGrade = grades.length > 0 ? grades[0].id : 0;
        }

        const grade = this.jobGradeRepository.find(jobGrade);
        const job = JobRegistry[jobId];

        TriggerServerEvent(ServerEvent.ADMIN_SET_JOB, jobId, jobGrade);

        this.notifier.notify(`Vous êtes maintenant '~g~'${grade ? grade.name : 'N/A'}'~s~' chez ~g~${job.label}~s~!`);
    }

    @OnNuiEvent(NuiEvent.AdminToggleDuty)
    public async setJobDuty(): Promise<void> {
        TriggerServerEvent(ServerEvent.QBCORE_TOGGLE_DUTY);
    }
}

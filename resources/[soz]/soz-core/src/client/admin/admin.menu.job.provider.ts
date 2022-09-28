import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Job } from '../../shared/job';
import { Qbcore } from '../qbcore';

@Provider()
export class AdminMenuJobProvider {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    @OnNuiEvent(NuiEvent.AdminGetJobs)
    public async getJobs(): Promise<Job[]> {
        // FIXME: Don't use QBCore.
        return this.QBCore.getJobs();
    }

    @OnNuiEvent(NuiEvent.AdminSetJob)
    public async setJob({ jobId, jobGrade }: { jobId: keyof Job; jobGrade: number }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SET_JOB, jobId, jobGrade);
    }

    @OnNuiEvent(NuiEvent.AdminToggleDuty)
    public async setJobDuty(): Promise<void> {
        TriggerServerEvent(ServerEvent.QBCORE_TOGGLE_DUTY);
    }
}

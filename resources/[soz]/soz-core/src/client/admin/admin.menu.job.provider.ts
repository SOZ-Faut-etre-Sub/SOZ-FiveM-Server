import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Job } from '../../shared/job';
import { Ok } from '../../shared/result';
import { RpcEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { Qbcore } from '../qbcore';

@Provider()
export class AdminMenuJobProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnNuiEvent(NuiEvent.AdminGetJobs)
    public async getJobs() {
        const jobs = await emitRpc<Job[]>(RpcEvent.JOB_GET_JOBS);
        return Ok(jobs);
    }

    @OnNuiEvent(NuiEvent.AdminSetJob)
    public async setJob({ jobId, jobGrade }: { jobId: Job['id']; jobGrade: number }): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_SET_JOB, jobId, jobGrade);

        const jobs = await emitRpc<Job[]>(RpcEvent.JOB_GET_JOBS);
        const job = jobs.find(job => job.id === jobId);
        const grade = job.grades.find(value => value.id === jobGrade) || '';

        this.notifier.notify(
            `Vous êtes maintenant ${grade ? '~g~' + grade.name + '~s~' : ''} chez ~g~${job.label}~s~!`
        );
    }

    @OnNuiEvent(NuiEvent.AdminToggleDuty)
    public async setJobDuty(): Promise<void> {
        TriggerServerEvent(ServerEvent.QBCORE_TOGGLE_DUTY);
    }
}

import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { JobGrade } from '../../shared/job';
import { RpcEvent } from '../../shared/rpc';

@Injectable()
export class JobGradeRepository {
    private jobGrades: JobGrade[] = [];

    public async load() {
        this.jobGrades = await emitRpc(RpcEvent.REPOSITORY_GET_DATA, 'jobGrade');
    }

    public update(jobGrades: JobGrade[]) {
        this.jobGrades = jobGrades;
    }

    public get(): JobGrade[] {
        return this.jobGrades;
    }
}

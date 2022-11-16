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

    public getJobGrade(job: string, grade: number): JobGrade | null {
        return this.jobGrades.find(x => x.jobId === job && x.id === grade) ?? null;
    }

    public get(): JobGrade[] {
        return this.jobGrades;
    }
}

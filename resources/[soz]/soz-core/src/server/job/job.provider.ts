import { Qbcore } from '../../client/qbcore';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Job } from '../../shared/job';
import { RpcEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class JobProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Rpc(RpcEvent.JOB_GET_JOBS)
    public async getJobs(): Promise<Job[]> {
        const jobs = this.QBCore.getJobs();

        const grades = await this.prismaService.job_grades.findMany({
            orderBy: {
                jobId: 'asc',
            },
        });

        grades.forEach(grade => {
            const job = jobs.find(j => j.id === grade.jobId);
            if (job) {
                if (!job.grades) {
                    job.grades = [];
                }
                job.grades.push({
                    id: grade.id,
                    jobId: grade.jobId,
                    salary: grade.salary,
                    name: grade.name,
                    is_default: grade.is_default === 1,
                    owner: grade.owner,
                    permissions: JSON.parse(grade.permissions),
                    weight: grade.weight,
                });
            }
        });

        return jobs;
    }
}

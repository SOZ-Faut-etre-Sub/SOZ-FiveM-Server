import { Inject, Injectable } from '../../core/decorators/injectable';
import { JobGrade, JobPermission } from '../../shared/job';
import { PrismaService } from '../database/prisma.service';
import { RepositoryLegacy } from './repository';

@Injectable()
export class JobGradeRepository extends RepositoryLegacy<JobGrade[]> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<JobGrade[]> {
        return (await this.prismaService.job_grades.findMany()).map(jobGrade => ({
            ...jobGrade,
            is_default: jobGrade.is_default === 1,
            permissions: JSON.parse(jobGrade.permissions) as JobPermission[],
        }));
    }
}

import { Inject, Injectable } from '../../core/decorators/injectable';
import { JobGrade } from '../../shared/job';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable()
export class JobGradeRepository extends Repository<JobGrade[]> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<JobGrade[]> {
        return (await this.prismaService.job_grades.findMany()).map(jobGrade => ({
            ...jobGrade,
            is_default: jobGrade.is_default === 1,
            permissions: JSON.parse(jobGrade.permissions) as string[],
        }));
    }
}

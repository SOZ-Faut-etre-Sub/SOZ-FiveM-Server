import { Inject, Injectable } from '../../core/decorators/injectable';
import { JobGrade, JobPermission, JobType } from '../../shared/job';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(JobGradeRepository, Repository)
export class JobGradeRepository extends Repository<RepositoryType.JobGrade> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.JobGrade;

    protected async load(): Promise<Record<number, JobGrade>> {
        const grades = await this.prismaService.job_grades.findMany();
        const list = {};

        for (const jobGrade of grades) {
            list[jobGrade.id] = {
                ...jobGrade,
                owner: jobGrade.owner === 1,
                is_default: jobGrade.is_default === 1,
                permissions: JSON.parse(jobGrade.permissions) as JobPermission[],
            };
        }

        return list;
    }

    public async getDefaultGrade(jobType: JobType): Promise<JobGrade | null> {
        const grades = await this.get();

        return grades.find(grade => grade.jobId === jobType && grade.is_default);
    }

    public async addGrade(jobType: JobType, name: string) {
        const grade = await this.prismaService.job_grades.create({
            data: {
                jobId: jobType,
                name,
                permissions: JSON.stringify([]),
                is_default: 0,
                owner: 0,
                weight: 0,
                salary: 0,
            },
        });

        this.data[grade.id] = {
            ...grade,
            owner: grade.owner === 1,
            is_default: grade.is_default === 1,
            permissions: JSON.parse(grade.permissions) as JobPermission[],
        };

        this.sync(grade.id);
    }

    public async removeGrade(gradeId: number) {
        await this.prismaService.job_grades.delete({
            where: {
                id: gradeId,
            },
        });

        this.delete(gradeId);
    }

    public async setGradeDefault(jobId: JobType, gradeId: number) {
        await this.prismaService.job_grades.updateMany({
            where: {
                jobId: jobId,
            },
            data: {
                is_default: 0,
            },
        });

        await this.prismaService.job_grades.update({
            where: {
                id: gradeId,
            },
            data: {
                is_default: 1,
            },
        });

        const currentDefaultGrade = await this.getDefaultGrade(jobId);

        this.data[currentDefaultGrade.id].is_default = false;
        this.data[gradeId].is_default = true;

        this.sync(currentDefaultGrade.id);
        this.sync(gradeId);
    }

    public async setGradeWeight(gradeId: number, weight: number) {
        await this.prismaService.job_grades.update({
            where: {
                id: gradeId,
            },
            data: {
                weight,
            },
        });

        this.data[gradeId].weight = weight;
        this.sync(gradeId);
    }

    public async setGradeSalary(gradeId: number, salary: number) {
        await this.prismaService.job_grades.update({
            where: {
                id: gradeId,
            },
            data: {
                salary,
            },
        });

        this.data[gradeId].salary = salary;
        this.sync(gradeId);
    }

    public async setGradePermissions(gradeId: number, permissions: JobPermission[]) {
        await this.prismaService.job_grades.update({
            where: {
                id: gradeId,
            },
            data: {
                permissions: JSON.stringify(permissions),
            },
        });

        this.data[gradeId].permissions = permissions;
        this.sync(gradeId);
    }
}

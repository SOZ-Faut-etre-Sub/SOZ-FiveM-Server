import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event/server';
import { JobPermission, JobType } from '../../shared/job';
import { JobService } from '../job.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { JobGradeRepository } from '../repository/job.grade.repository';

@Provider()
export class JobGradeProvider {
    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.JOB_GRADE_ADD)
    public async addGrade(source: number, name: string) {
        const jobType = await this.getJobType(source);

        if (!jobType) {
            return;
        }

        await this.jobGradeRepository.addGrade(jobType, name);

        this.notifier.notify(source, `Le grade ${name} a bien été ajouté.`);
    }

    @OnEvent(ServerEvent.JOB_GRADE_REMOVE)
    public async removeGrade(source: number, gradeId: number) {
        const grade = await this.jobGradeRepository.find(gradeId);

        if (!grade) {
            return;
        }

        if (grade.owner) {
            this.notifier.error(source, `Vous ne pouvez pas supprimer le grade de patron !`);

            return;
        }

        if (grade.is_default) {
            this.notifier.error(source, `Vous ne pouvez pas supprimer le grade par défaut !`);

            return;
        }

        await this.jobGradeRepository.removeGrade(gradeId);

        this.notifier.notify(source, `Le grade ${grade.name} a bien été supprimé.`);
    }

    @OnEvent(ServerEvent.JOB_GRADE_SET_DEFAULT)
    public async setGradeDefault(source: number, gradeId: number) {
        const jobType = await this.getJobType(source);

        if (!jobType) {
            return;
        }

        const grade = await this.jobGradeRepository.find(gradeId);

        if (!grade) {
            return;
        }

        await this.jobGradeRepository.setGradeDefault(jobType, gradeId);

        this.notifier.notify(source, `Le grade ${grade.name} a été défini par défaut !`);
    }

    @OnEvent(ServerEvent.JOB_GRADE_SET_WEIGHT)
    public async setGradeWeight(source: number, gradeId: number, weight: number) {
        const grade = await this.jobGradeRepository.find(gradeId);

        if (!grade) {
            return;
        }

        await this.jobGradeRepository.setGradeWeight(gradeId, weight);

        this.notifier.notify(source, `Le poids a bien été défini !`);
    }

    @OnEvent(ServerEvent.JOB_GRADE_SET_SALARY)
    public async setGradeSalary(source: number, gradeId: number, salary: number) {
        const grade = await this.jobGradeRepository.find(gradeId);

        if (!grade) {
            return;
        }

        await this.jobGradeRepository.setGradeSalary(gradeId, salary);

        this.notifier.notify(source, `Le salaire a bien été défini !`);
    }

    @OnEvent(ServerEvent.JOB_GRADE_SET_PERMISSION)
    public async setGradePermission(source: number, gradeId: number, permission: JobPermission, value: boolean) {
        const grade = await this.jobGradeRepository.find(gradeId);

        if (!grade) {
            return;
        }

        const newPermissions = grade.permissions.filter(p => p !== permission);

        if (value) {
            newPermissions.push(permission);
        }

        await this.jobGradeRepository.setGradePermissions(gradeId, newPermissions);

        if (value) {
            this.notifier.notify(source, `La permission a bien été ajoutée !`);
        } else {
            this.notifier.notify(source, `La permission a bien été supprimée !`);
        }
    }

    private async getJobType(source: number): Promise<JobType> {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return null;
        }

        if (!(await this.jobService.hasPermissions(player, player.job.id, [JobPermission.ManageGrade]))) {
            return null;
        }

        return player.job.id;
    }
}

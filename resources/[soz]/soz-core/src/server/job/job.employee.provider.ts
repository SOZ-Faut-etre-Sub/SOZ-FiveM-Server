import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ServerEvent } from '../../shared/event/server';
import { JobPermission, JobType } from '../../shared/job';
import { RpcServerEvent } from '../../shared/rpc';
import { JobService } from '../job.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { JobGradeRepository } from '../repository/job.grade.repository';

@Provider()
export class JobEmployeeProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @Rpc(RpcServerEvent.PLAYER_GET_JOB)
    public async getJob(source: number, target: number): Promise<JobType | null> {
        const player = this.playerService.getPlayer(target);

        if (!player) {
            return null;
        }

        return player.job.id;
    }

    @OnEvent(ServerEvent.JOB_RECRUIT)
    public async recruit(source: number, target: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(target);

        if (!targetPlayer) {
            return;
        }
        if (
            !(await this.jobService.hasAnyPermission(player, player.job.id, [
                JobPermission.Enrollment,
                JobPermission.ManageGrade,
            ]))
        ) {
            return;
        }

        if (targetPlayer.job.id !== JobType.Unemployed) {
            this.notifier.error(source, "Le joueur n'est pas au chômage");

            return;
        }

        const defaultGrade = await this.jobGradeRepository.getDefaultGrade(player.job.id);

        this.playerService.setJob(target, player.job.id, defaultGrade.id);

        this.notifier.notify(source, 'Le joueur fait maintenant partie de vos effectifs !');
        this.notifier.notify(target, 'Vous avez été ~g~embauché~s~ !');
    }

    @OnEvent(ServerEvent.JOB_FIRE)
    public async fire(source: number, target: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(target);

        if (!targetPlayer) {
            return;
        }

        if (
            !(await this.jobService.hasAnyPermission(player, player.job.id, [
                JobPermission.Enrollment,
                JobPermission.ManageGrade,
            ]))
        ) {
            return;
        }

        if (targetPlayer.job.id !== player.job.id) {
            this.notifier.error(source, 'Le joueur ne peut pas être viré !');

            return;
        }

        const playerGrade = await this.jobGradeRepository.find(Number(player.job.grade));
        const targetGrade = await this.jobGradeRepository.find(Number(targetPlayer.job.grade));

        if (!playerGrade || !targetGrade) {
            return;
        }

        if (playerGrade.weight < targetGrade.weight) {
            this.notifier.error(source, 'Le joueur ne peut pas être viré !');

            return;
        }

        if (targetPlayer.job.onduty) {
            this.playerService.setJobDuty(target, false);
        }

        const defaultGrade = await this.jobGradeRepository.getDefaultGrade(JobType.Unemployed);
        this.playerService.setJob(target, JobType.Unemployed, defaultGrade ? defaultGrade.id : 0);

        this.notifier.notify(source, 'Le joueur ne fait plus partie de vos effectifs !');
        this.notifier.notify(target, 'Vous avez été ~r~viré~s~ !');
    }

    @OnEvent(ServerEvent.JOB_PROMOTE)
    public async promote(source: number, target: number, gradeId: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(target);

        if (!targetPlayer) {
            return;
        }

        if (targetPlayer.job.id !== player.job.id) {
            this.notifier.error(source, 'Le joueur ne peut pas être promu !');

            return;
        }

        if (
            !(await this.jobService.hasAnyPermission(player, player.job.id, [
                JobPermission.Enrollment,
                JobPermission.ManageGrade,
            ]))
        ) {
            return;
        }

        const playerGrade = await this.jobGradeRepository.find(Number(player.job.grade));
        const targetGrade = await this.jobGradeRepository.find(Number(targetPlayer.job.grade));
        const wantedGrade = await this.jobGradeRepository.find(gradeId);

        if (!playerGrade || !targetGrade || !wantedGrade) {
            return;
        }

        if (playerGrade.weight < targetGrade.weight || playerGrade.weight < wantedGrade.weight) {
            this.notifier.error(source, 'Le joueur ne peut pas être promu !');

            return;
        }

        this.playerService.setJob(target, targetPlayer.job.id, wantedGrade.id);

        this.notifier.notify(source, `Le joueur a été promu ~b~${wantedGrade.name}~s~ !`);
        this.notifier.notify(target, `Vous avez été promu ~b~${wantedGrade.name}~s~ !`);
    }
}

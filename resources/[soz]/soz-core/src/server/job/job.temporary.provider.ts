import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event/server';
import { JobType } from '../../shared/job';
import { JobService } from '../job.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { JobGradeRepository } from '../repository/job.grade.repository';
import { VehicleSpawner } from '../vehicle/vehicle.spawner';

@Provider()
export class JobTemporaryProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @OnEvent(ServerEvent.JOB_TEMPORARY_UNEMPLOYED)
    public async temporaryUnemployed(source: number, vehicleNetId: number) {
        this.playerService.setJob(source, JobType.Unemployed, null);
        this.notifier.notify(source, 'Vous êtes à nouveau sans emploi');

        await this.vehicleSpawner.delete(vehicleNetId);
    }

    @OnEvent(ServerEvent.JOB_TEMPORARY_SET_JOB)
    public async setJob(source: number, jobType: JobType) {
        const job = this.jobService.getJob(jobType);

        if (!job) {
            return;
        }

        this.notifier.notify(source, `Vous commencez le travail: ${job.label}.`);

        const grade = await this.jobGradeRepository.getDefaultGrade(jobType);

        this.playerService.setJob(source, jobType, grade ? grade.id : 0);
    }

    @OnEvent(ServerEvent.JOB_TEMPORARY_PAYOUT)
    public payout(source: number, money: number): void {
        this.playerMoneyService.add(source, money, 'money');

        this.notifier.notify(source, `Vous recevez ${money} $ pour votre travail`);
    }
}

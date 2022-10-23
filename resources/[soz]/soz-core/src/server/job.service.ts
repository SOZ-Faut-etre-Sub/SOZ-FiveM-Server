import { Injectable } from '../core/decorators/injectable';
import { JobPermission, JobType } from '../shared/job';
import { PlayerData } from '../shared/player';

@Injectable()
export class JobService {
    private SozJobCore;

    public constructor() {
        this.SozJobCore = exports['soz-jobs'].GetCoreObject();
    }

    public hasPermission(player: PlayerData, job: JobType, permission: JobPermission): boolean {
        return this.SozJobCore.Functions.HasPermission(job, player.job.id, player.job.grade, permission);
    }
}

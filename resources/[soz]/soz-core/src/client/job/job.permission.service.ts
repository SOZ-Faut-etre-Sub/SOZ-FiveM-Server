import { Inject, Injectable } from '../../core/decorators/injectable';
import { JobPermission, JobType } from '../../shared/job';
import { Qbcore } from '../qbcore';

@Injectable()
export class JobPermissionService {
    @Inject(Qbcore)
    private QBCore: Qbcore;

    public hasPermission(job: JobType, permission: JobPermission): boolean {
        return this.QBCore.hasJobPermission(job, permission);
    }
}

import { JobType } from '../job';

export interface NuiJobEmployeeOnDuty {
    job: JobType;
    state: string[];
}

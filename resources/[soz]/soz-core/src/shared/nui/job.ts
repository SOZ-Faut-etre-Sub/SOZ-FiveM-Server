import { JobGrade, JobType } from '../job';

export interface NuiJobEmployeeOnDuty {
    job: JobType;
    state: string[];
}

export type PromoteMenuData = { job: JobType; grades: JobGrade[]; target: number };

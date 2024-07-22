import { Module } from '../../core/decorators/module';
import { JobEmployeeProvider } from './job.employee.provider';
import { JobGradeProvider } from './job.grade.provider';
import { JobProvider } from './job.provider';
import { JobResellProvider } from './job.resell.provider';
import { JobTemporaryProvider } from './job.temporary.provider';

@Module({
    providers: [JobEmployeeProvider, JobGradeProvider, JobProvider, JobTemporaryProvider, JobResellProvider],
})
export class JobModule {}

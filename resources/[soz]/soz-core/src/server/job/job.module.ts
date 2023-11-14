import { Module } from '../../core/decorators/module';
import { JobEmployeeProvider } from './job.employee.provider';
import { JobGradeProvider } from './job.grade.provider';
import { JobProvider } from './job.provider';
import { JobTemporaryProvider } from './job.temporary.provider';

@Module({
    providers: [JobEmployeeProvider, JobGradeProvider, JobProvider, JobTemporaryProvider],
})
export class JobModule {}

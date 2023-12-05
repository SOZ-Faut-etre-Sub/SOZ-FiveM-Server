import { Module } from '../../core/decorators/module';
import { JobCloakroomProvider } from './job.cloakroom.provider';
import { JobDutyProvider } from './job.duty.provider';
import { JobMenuProvider } from './job.menu.provider';
import { JobProvider } from './job.provider';

@Module({
    providers: [JobCloakroomProvider, JobDutyProvider, JobMenuProvider, JobProvider],
})
export class JobModule {}

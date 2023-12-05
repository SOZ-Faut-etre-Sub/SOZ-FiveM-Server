import { Module } from '../../core/decorators/module';
import { JobCloakroomProvider } from './job.cloakroom.provider';
import { JobMenuProvider } from './job.menu.provider';
import { JobProvider } from './job.provider';

@Module({
    providers: [JobCloakroomProvider, JobMenuProvider, JobProvider],
})
export class JobModule {}

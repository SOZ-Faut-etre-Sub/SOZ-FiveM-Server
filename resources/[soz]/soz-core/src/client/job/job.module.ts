import { Module } from '../../core/decorators/module';
import { JobCloakroomProvider } from './job.cloakroom.provider';
import { JobProvider } from './job.provider';

@Module({
    providers: [JobCloakroomProvider, JobProvider],
})
export class JobModule {}

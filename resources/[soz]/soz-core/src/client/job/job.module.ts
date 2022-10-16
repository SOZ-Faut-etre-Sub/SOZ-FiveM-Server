import { Module } from '../../core/decorators/module';
import { JobProvider } from './job.provider';

@Module({
    providers: [JobProvider],
})
export class JobModule {}

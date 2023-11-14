import { Module } from '../../../core/decorators/module';
import { TemporaryProvider } from './temporary.provider';

@Module({
    providers: [TemporaryProvider],
})
export class JobTemporaryModule {}

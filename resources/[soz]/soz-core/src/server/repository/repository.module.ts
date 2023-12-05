import { Module } from '../../core/decorators/module';
import { RepositoryProvider } from './repository.provider';

@Module({
    providers: [RepositoryProvider],
})
export class RepositoryModule {}

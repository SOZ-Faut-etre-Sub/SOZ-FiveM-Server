import { Module } from '../../core/decorators/module';
import { ApiProvider } from './api.provider';

@Module({
    providers: [ApiProvider],
})
export class ApiModule {}

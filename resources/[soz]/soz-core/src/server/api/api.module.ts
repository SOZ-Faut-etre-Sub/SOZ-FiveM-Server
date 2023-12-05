import { Module } from '../../core/decorators/module';
import { ApiNewsProvider } from './api.news.provider';
import { ApiProvider } from './api.provider';

@Module({
    providers: [ApiProvider, ApiNewsProvider],
})
export class ApiModule {}

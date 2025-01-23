import { Module } from '../../core/decorators/module';
import { ApiNewsProvider } from './api.news.provider';
import { ApiPhoneProvider } from './api.phone.provider';
import { ApiProvider } from './api.provider';

@Module({
    providers: [ApiProvider, ApiNewsProvider, ApiPhoneProvider],
})
export class ApiModule {}

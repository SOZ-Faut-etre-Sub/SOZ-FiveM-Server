import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { NewsMessage } from '../../shared/phone/apps/news';
import { ApiClient } from './api.client';

@Provider()
export class ApiNewsProvider {
    @Inject(Logger)
    private logger: Logger;

    @Inject(ApiClient)
    private apiClient: ApiClient;

    public async sendFlashNews(news: NewsMessage) {
        const response = await this.apiClient.post('/news/add-flash', news);

        if (response.status !== 201) {
            this.logger.error(`error when adding flash news, status: ${String(response.status)} ${response.data}`);
        }
    }
}

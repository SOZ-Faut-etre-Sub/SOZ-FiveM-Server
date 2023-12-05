import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { ServerEvent } from '../../shared/event';
import { ApiClient } from './api.client';

@Provider()
export class ApiNewsProvider {
    @Inject(Logger)
    private logger: Logger;

    @Inject(ApiClient)
    private apiClient: ApiClient;

    @OnEvent(ServerEvent.NEWS_ADD_FLASH, false)
    public async sendFlashNews(news: any) {
        const response = await this.apiClient.post('/news/add-flash', news);

        if (response.status !== 201) {
            this.logger.error('error when adding flash news, status:', String(response.status), response.data);
        }
    }
}

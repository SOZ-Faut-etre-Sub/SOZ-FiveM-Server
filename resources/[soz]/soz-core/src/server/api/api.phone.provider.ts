import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Logger } from '../../core/logger';
import { PlayerData } from '../../shared/player';
import { ApiClient } from './api.client';

@Provider()
export class ApiPhoneProvider {
    @Inject(Logger)
    private logger: Logger;

    @Inject(ApiClient)
    private apiClient: ApiClient;

    public async sendFbiMessage(player: PlayerData, message: string) {
        const response = await this.apiClient.post('/discord/send-fbi', {
            phone: player.charinfo.phone,
            username: player.name,
            data: message,
        });

        if (response.status !== 201) {
            this.logger.error(`error when sending fbi message, status: ${String(response.status)} ${response.data}`);
        }
    }
}

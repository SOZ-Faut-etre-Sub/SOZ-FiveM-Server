import axios from 'axios';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Logger } from '../../core/logger';

@Injectable()
export class ApiClient {
    @Inject(Logger)
    private logger: Logger;

    public async post(path: string, data: any) {
        const url = GetConvar('soz_api_endpoint', 'https://api.soz.zerator.com') + path;

        return await axios.post(url, data, {
            auth: {
                username: GetConvar('soz_api_username', 'admin'),
                password: GetConvar('soz_api_password', 'admin'),
            },
            validateStatus: () => true,
        });
    }

    public async addRebootMessage(minutes: number) {
        const response = await this.post('/discord/send-reboot-message', {
            minutes,
        });

        if (response.status !== 201) {
            this.logger.error('error when adding reboot message, status:', String(response.status), response.data);
        }
    }

    public async removeRebootMessage() {
        const response = await this.post('/discord/delete-reboot-message', {});

        if (response.status !== 201) {
            this.logger.error('error when removing reboot message, status:', String(response.status), response.data);
        }
    }
}

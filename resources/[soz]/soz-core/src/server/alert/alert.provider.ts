import { ServerEvent } from '@public/shared/event';

import { On, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';

@Provider()
export class AlertProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.ALERT_MESSAGE, false)
    public sendPoliceAlert(message) {
        let messageLogo: 'bcso' | 'lspd' | 'fib' = 'lspd';
        if (message.info && message.info.serviceNumber) {
            if (message.info.serviceNumber === '555-BCSO') {
                messageLogo = 'bcso';
            }
            if (message.info.serviceNumber === '555-FBI') {
                messageLogo = 'fib';
            }
        }

        this.notifier.policeNotify(message.player, '', message.message, messageLogo, message.info.type, message.createdAt, 15000);
    }
}

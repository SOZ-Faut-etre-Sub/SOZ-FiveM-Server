import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { NotificationType } from '../../shared/notification';
import { Notifier } from '../notifier';

@Provider()
export class HudNotificationsProvider {
    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Exportable('DrawNotification')
    @OnEvent(ClientEvent.NOTIFICATION_DRAW)
    public drawNotification(message: string, type: NotificationType, delay = 10000): void {
        this.notifier.notify(message, type, delay);
    }

    @Exportable('DrawAdvancedNotification')
    @OnEvent(ClientEvent.NOTIFICATION_DRAW_ADVANCED)
    public async drawAdvancedNotification(
        title: string,
        subtitle: string,
        message: string,
        image: string,
        style: NotificationType,
        delay = 10000
    ) {
        await this.notifier.notifyAdvanced({
            title,
            subtitle,
            message,
            image,
            style,
            delay,
        });
    }

    @Exportable('SendPoliceNotification')
    public async getPoliceNotification(message) {
        let messageLogo: 'bcso' | 'lspd' | 'sasp' | 'police' = 'police';
        if (message.info && message.info.serviceNumber) {
            if (message.info.serviceNumber === '555-BCSO') {
                messageLogo = 'bcso';
            }
            if (message.info.serviceNumber === '555-LSPD') {
                messageLogo = 'lspd';
            }
            if (message.info.serviceNumber === '555-SASP') {
                messageLogo = 'sasp';
            }
        }
        const duration =
            message.info !== undefined && message.info.duration !== undefined ? message.info.duration : 5000;

        const messageType = message.info.type ?? 'default';

        await this.notifier.notifyPolice({
            title: '',
            message: message.htmlMessage ?? message.message,
            logo: messageLogo,
            policeStyle: messageType,
            style: 'info',
            hour: message.createdAt,
            delay: duration,
            notificationId: message.info.notificationId,
        });
    }
}

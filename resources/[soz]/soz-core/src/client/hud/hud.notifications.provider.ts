import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { NotificationPoliceLogoType, NotificationPoliceType, NotificationType } from '../../shared/notification';
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

    @Exportable('DrawAdvancedNotification')
    @OnEvent(ClientEvent.NOTIFICATION_DRAW_POLICE)
    public async drawPoliceNotification(
        title: string,
        message: string,
        logo: NotificationPoliceLogoType,
        type: NotificationPoliceType,
        hour: string,
        delay = 10000
    ) {
        await this.notifier.notifyPolice({
            title,
            message,
            logo,
            policeStyle: type,
            style: 'info',
            hour,
            delay,
        });
    }
}

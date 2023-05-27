import { Inject, Injectable } from '@core/decorators/injectable';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { ResourceLoader } from '@public/client/resources/resource.loader';
import { AdvancedNotification, NotificationType, TPoliceNotification } from '@public/shared/notification';

@Injectable()
export class Notifier {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    public notify(message: string, type: NotificationType = 'info', delay = 10000) {
        this.nuiDispatch.dispatch('hud', 'DrawNotification', {
            style: type,
            message,
            delay,
        });
    }

    public async notifyAdvanced(notification: Omit<AdvancedNotification, 'id'>) {
        if (notification.image) {
            await this.resourceLoader.loadStreamedTextureDict(notification.image);
        }

        this.nuiDispatch.dispatch('hud', 'DrawNotification', {
            style: 'info',
            delay: 10000,
            ...notification,
        });
    }

    public async notifyPolice(notification: Omit<TPoliceNotification, 'id'>) {
        this.nuiDispatch.dispatch('hud', 'DrawNotification', {
            style: 'info',
            delay: 5000,
            ...notification,
        });
    }

    public error(source: number, message: string) {
        this.notify(message, 'error');
    }
}

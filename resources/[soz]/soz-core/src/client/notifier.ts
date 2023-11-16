import { Inject, Injectable } from '@core/decorators/injectable';
import { uuidv4, wait } from '@core/utils';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { Control } from '@public/shared/input';
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

    public async notifyWithConfirm(message: string, type: NotificationType = 'info', delay = 20000): Promise<boolean> {
        let timeout = false;

        wait(delay).then(() => {
            timeout = true;
        });

        const id = uuidv4();

        this.nuiDispatch.dispatch('hud', 'DrawNotification', {
            id,
            style: type,
            message,
            delay,
        });

        while (!timeout) {
            DisableControlAction(0, Control.MpTextChatTeam, true);
            DisableControlAction(0, Control.PushToTalk, true);

            if (IsDisabledControlJustPressed(0, Control.MpTextChatTeam)) {
                this.nuiDispatch.dispatch('hud', 'CancelNotification', id);

                return true;
            }

            if (IsDisabledControlJustPressed(0, Control.PushToTalk)) {
                this.nuiDispatch.dispatch('hud', 'CancelNotification', id);

                return false;
            }

            await wait(0);
        }

        this.nuiDispatch.dispatch('hud', 'CancelNotification', id);

        return false;
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

    public error(message: string) {
        this.notify(message, 'error');
    }
}

import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent } from '@public/shared/event';
import { ServerEvent } from '@public/shared/event/server';

import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { TornadoProvider } from './tornado.provider';

@Provider()
export class FirestormProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(TornadoProvider)
    private tornadoProvider: TornadoProvider;

    @Inject(Notifier)
    public notifier: Notifier;

    @OnEvent(ServerEvent.ADMIN_FIRESTORM)
    public async onTornado(source: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        const tornado = this.tornadoProvider.getState();
        if (!tornado) {
            this.notifier.error(source, 'Pas de tornade active');
            return;
        }

        TriggerLatentClientEvent(ClientEvent.FIRESTORM, -1, 1024, tornado.endPosition, source);
    }
}

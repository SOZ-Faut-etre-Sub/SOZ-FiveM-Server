import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { ClientEvent, ServerEvent } from '@public/shared/event';

import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';

@Provider()
export class EarthquakeProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(Notifier)
    public notifier: Notifier;

    @OnEvent(ServerEvent.ADMIN_EARTHQUAKE)
    public async flood(source: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }
        this.notifier.notify(source, 'Lancement du temblement de terre...');

        TriggerLatentClientEvent(ClientEvent.EARTHQUAKE, -1, 1024);
    }
}

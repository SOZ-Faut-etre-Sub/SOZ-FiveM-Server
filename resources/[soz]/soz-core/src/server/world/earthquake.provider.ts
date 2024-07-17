import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';

@Provider()
export class EarthquakeProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(Notifier)
    public notifier: Notifier;

    private earthQuake = false;

    @Rpc(RpcServerEvent.METEOR_EARTHQUAKE)
    public isEarthQuake() {
        return this.earthQuake;
    }

    @OnEvent(ServerEvent.ADMIN_EARTHQUAKE)
    public async onEarthQuake(source: number, value: boolean) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }
        this.earthQuake = value;
        if (value) {
            this.notifier.notify(source, 'Lancement du temblement de terre...');
        } else {
            this.notifier.notify(source, 'Arret du temblement de terre...');
        }

        TriggerLatentClientEvent(ClientEvent.EARTHQUAKE, -1, 1024, value);
    }
}

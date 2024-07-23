import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { ClientEvent, ServerEvent } from '@public/shared/event';

import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { WeaponProvider } from '../weapon/weapon.provider';

@Provider()
export class EarthquakeProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(WeaponProvider)
    public weaponProvider: WeaponProvider;

    private earthQuake = false;

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
        this.weaponProvider.setDisableExplosionAlert(this.earthQuake);

        TriggerLatentClientEvent(ClientEvent.EARTHQUAKE, -1, 1024, value);
    }
}

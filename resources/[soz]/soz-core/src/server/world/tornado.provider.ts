import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import { ServerEvent } from '@public/shared/event/server';
import { Vector3 } from '@public/shared/polyzone/vector';

import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { WeaponProvider } from '../weapon/weapon.provider';

@Provider()
export class TornadoProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(WeaponProvider)
    public weaponProvider: WeaponProvider;

    private state: {
        startTime: number;
        startPosition: Vector3;
        endPosition: Vector3;
    };

    @OnEvent(ServerEvent.ADMIN_TORNADO)
    public async onTornado(source: number, value: boolean, coords: Vector3, time: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        if (value) {
            if (this.state) {
                this.notifier.error(source, 'Une tornade est déjà en cours...');
                return;
            }

            this.state = {
                startTime: time,
                startPosition: coords,
                endPosition: coords,
            };
            this.notifier.notify(source, 'Lancement de la tornade...');
            TriggerLatentClientEvent(
                ClientEvent.TORNADO,
                -1,
                1024,
                this.state?.startTime,
                this.state?.startPosition,
                this.state?.endPosition
            );
            this.weaponProvider.setDisableExplosionAlert(true);
        } else {
            this.notifier.notify(source, 'Arrêt de la tornade en cours...');
            TriggerLatentClientEvent(ClientEvent.TORNADO, -1, 1024);
            await wait(20_000);
            this.notifier.notify(source, 'Arrêt de la tornade');
            this.weaponProvider.setDisableExplosionAlert(false);
            this.state = null;
        }
    }

    @OnEvent(ServerEvent.ADMIN_TORNADO_MOVE)
    public async onTornadoMove(source: number, destination: Vector3, coords: Vector3, time: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        if (!this.state) {
            this.notifier.error(source, 'Pas de tornade en cours...');
            return;
        }

        this.state = {
            startTime: time,
            startPosition: coords,
            endPosition: destination,
        };

        TriggerLatentClientEvent(
            ClientEvent.TORNADO,
            -1,
            1024,
            this.state?.startTime,
            this.state?.startPosition,
            this.state?.endPosition
        );
    }

    public isRunning() {
        return !!this.state;
    }

    @OnEvent(ServerEvent.TORNADO)
    public async onInitTornado(source: number) {
        TriggerLatentClientEvent(
            ClientEvent.TORNADO,
            source,
            1024,
            this.state?.startTime,
            this.state?.startPosition,
            this.state?.endPosition,
            true
        );
    }

    public getState() {
        return this.state;
    }
}

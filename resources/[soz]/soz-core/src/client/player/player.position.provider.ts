import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { emitRpc } from '@public/core/rpc';
import { Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { WeaponDrawingProvider } from '../weapon/weapon.drawing.provider';

@Provider()
export class PlayerPositionProvider {
    private readonly fadeDelay = 500;

    @Inject(WeaponDrawingProvider)
    private weaponDrawingProvider: WeaponDrawingProvider;

    @OnEvent(ClientEvent.PLAYER_TELEPORT)
    async onPlayerTeleport(zone: string) {
        await this.teleportPlayerToPosition(zone);
    }

    async teleportPlayerToPosition(target: string, cb?: () => void) {
        const playerPed = PlayerPedId();

        DoScreenFadeOut(this.fadeDelay);
        await wait(this.fadeDelay);
        await this.weaponDrawingProvider.undrawWeapons();

        FreezeEntityPosition(playerPed, true);

        await emitRpc(RpcServerEvent.PLAYER_TELEPORT, target);

        while (!HasCollisionLoadedAroundEntity(playerPed)) {
            await wait(1);
        }

        await wait(1000);

        FreezeEntityPosition(playerPed, false);

        cb && cb();

        this.weaponDrawingProvider.drawWeapons();
        DoScreenFadeIn(this.fadeDelay);
        await wait(this.fadeDelay);
    }

    async teleportAdminToPosition([x, y, z, w]: Vector4) {
        const playerPed = PlayerPedId();
        await this.weaponDrawingProvider.undrawWeapons();

        FreezeEntityPosition(playerPed, true);

        SetEntityCoords(playerPed, x, y, z, false, false, false, false);
        SetEntityHeading(playerPed, w || 0.0);

        while (!HasCollisionLoadedAroundEntity(playerPed)) {
            await wait(1);
        }

        await wait(1000);

        FreezeEntityPosition(playerPed, false);

        this.weaponDrawingProvider.drawWeapons();
    }
}

import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';

import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { Vector4 } from '../../shared/polyzone/vector';
import { WeaponDrawingProvider } from '../weapon/weapon.drawing.provider';

@Provider()
export class PlayerPositionProvider {
    private readonly fadeDelay = 500;

    @Inject(WeaponDrawingProvider)
    private weaponDrawingProvider: WeaponDrawingProvider;

    @OnEvent(ClientEvent.PLAYER_TELEPORT)
    async onPlayerTeleport([x, y, z, w]: Vector4) {
        await this.teleportPlayerToPosition([x, y, z, w]);
    }

    getPlayerPosition() {
        return GetEntityCoords(PlayerPedId(), false);
    }

    async teleportPlayerToPosition([x, y, z, w]: Vector4) {
        const playerPed = PlayerPedId();

        DoScreenFadeOut(this.fadeDelay);
        await wait(this.fadeDelay);
        this.weaponDrawingProvider.undrawWeapons();

        FreezeEntityPosition(playerPed, true);

        SetEntityCoords(playerPed, x, y, z, false, false, false, false);
        SetEntityHeading(playerPed, w || 0.0);

        while (!HasCollisionLoadedAroundEntity(playerPed)) {
            await wait(1);
        }

        FreezeEntityPosition(playerPed, false);

        await wait(this.fadeDelay);

        this.weaponDrawingProvider.drawWeapons();
        DoScreenFadeIn(this.fadeDelay);
    }
}

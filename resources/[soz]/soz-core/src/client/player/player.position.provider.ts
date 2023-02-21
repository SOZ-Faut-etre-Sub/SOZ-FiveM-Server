import { OnEvent } from '@public/core/decorators/event';

import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { Vector4 } from '../../shared/polyzone/vector';

@Provider()
export class PlayerPositionProvider {
    private readonly fadeDelay = 500;

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

        SetEntityCoords(playerPed, x, y, z, false, false, false, false);
        SetEntityHeading(playerPed, w || 0.0);

        DoScreenFadeIn(this.fadeDelay);
    }
}

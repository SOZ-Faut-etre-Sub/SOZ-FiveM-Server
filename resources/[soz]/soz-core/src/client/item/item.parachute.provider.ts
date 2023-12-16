import { Tick } from '@public/core/decorators/tick';
import { PlayerData } from '@public/shared/player';

import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';

@Provider()
export class ItemParachuteProvider {
    private hasConsumedParachute = false;

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    public onPlayerUpdate(player: PlayerData) {
        const ped = PlayerPedId();
        const parachuteWeapon = GetHashKey('GADGET_PARACHUTE');

        for (const item of Object.values(player.items)) {
            if (item.name == 'parachute') {
                if (!HasPedGotWeapon(ped, parachuteWeapon, false)) {
                    GiveWeaponToPed(ped, parachuteWeapon, 1, false, false);
                }
                return;
            }
        }

        if (HasPedGotWeapon(ped, parachuteWeapon, false)) {
            RemoveWeaponFromPed(ped, parachuteWeapon);
        }
    }

    @Tick(100)
    public onParachuteTick() {
        const playerPed = PlayerPedId();
        if (!this.hasConsumedParachute && GetPedParachuteState(playerPed) == 1) {
            TriggerServerEvent('inventory:server:RemoveItem', GetPlayerServerId(PlayerId()), 'parachute', 1);
            this.hasConsumedParachute = true;
        } else if (this.hasConsumedParachute && [0, 3].includes(GetPedParachuteState(playerPed))) {
            this.hasConsumedParachute = false;
        }
    }
}

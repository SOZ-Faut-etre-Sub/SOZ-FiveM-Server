import { PlayerInventoryUpdate } from '@public/core/decorators/player';
import { Tick } from '@public/core/decorators/tick';

import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event/server';
import { InventoryItem } from '../../shared/inventory';

@Provider()
export class ItemParachuteProvider {
    private hasConsumedParachute = false;

    @PlayerInventoryUpdate()
    public onPlayerUpdate(items: Record<number, InventoryItem>) {
        const ped = PlayerPedId();
        const parachuteWeapon = GetHashKey('GADGET_PARACHUTE');

        for (const item of Object.values(items)) {
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
            TriggerServerEvent(ServerEvent.INVENTORY_REMOVE_PLAYER_ITEM, 'parachute', 1);
            this.hasConsumedParachute = true;
        } else if (this.hasConsumedParachute && [0, 3].includes(GetPedParachuteState(playerPed))) {
            this.hasConsumedParachute = false;
        }
    }
}

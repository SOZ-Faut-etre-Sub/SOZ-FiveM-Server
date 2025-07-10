import { PlayerInventoryUpdate } from '@public/core/decorators/player';
import { Tick } from '@public/core/decorators/tick';

import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event/server';
import { InventoryItem } from '../../shared/inventory';

const parachuteTints: Record<string, number> = {
    rainbow: 0,
    red: 1,
    seasidestripes: 2,
    widowmaker: 3,
    patriot: 4,
    blue: 5,
    black: 6,
    hornet: 7,
    // airfocce: 8,
    // desert: 9,
    // shadow: 10,
    // highaltitude: 11,
    // airbone: 12,
    // sunrise: 13,
};

@Provider()
export class ItemParachuteProvider {
    private hasConsumedParachute = false;
    private lastParachuteName: string | null = null;

    @PlayerInventoryUpdate()
    public onPlayerUpdate(items: Record<number, InventoryItem>) {
        const ped = PlayerPedId();
        const parachuteWeapon = GetHashKey('GADGET_PARACHUTE');
        this.lastParachuteName = null;

        for (const item of Object.values(items)) {
            if (item.name.startsWith('parachute')) {
                if (!HasPedGotWeapon(ped, parachuteWeapon, false)) {
                    GiveWeaponToPed(ped, parachuteWeapon, 1, false, false);
                }
                const parts = item.name.split('_');
                const tintName = parts[1] || 'rainbow';
                const tintIndex = parachuteTints[tintName.toLowerCase()] ?? 0;
                SetPedParachuteTintIndex(ped, tintIndex);
                this.lastParachuteName = item.name;
                return;
            }
        }

        if (HasPedGotWeapon(ped, parachuteWeapon, false)) {
            RemoveWeaponFromPed(ped, parachuteWeapon);
        }
        this.lastParachuteName = null;
    }

    @Tick(100)
    public onParachuteTick() {
        const playerPed = PlayerPedId();
        if (
          !this.hasConsumedParachute &&
          GetPedParachuteState(playerPed) == 1 &&
          this.lastParachuteName
        ) {
            TriggerServerEvent(ServerEvent.INVENTORY_REMOVE_PLAYER_ITEM, this.lastParachuteName, 1);
            this.hasConsumedParachute = true;
        } else if (
          this.hasConsumedParachute &&
          [0, 3].includes(GetPedParachuteState(playerPed))
        ) {
            this.hasConsumedParachute = false;
        }
    }
}

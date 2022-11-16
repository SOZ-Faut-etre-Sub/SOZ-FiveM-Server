import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { InventoryManager } from '../item/inventory.manager';

const WEAPON_NAME_REGEX = /([^a-z0-9 ._-]+)/gi;

@Provider()
export class WeaponGunsmithProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @OnEvent(ServerEvent.WEAPON_GUNSMITH_RENAME)
    async renameWeapon(source: number, slot: number, label: string) {
        const weapon = this.inventoryManager.getSlot(source, slot);
        if (!weapon) {
            return;
        }

        if (weapon.type !== 'weapon') {
            return;
        }

        if (label.length < 2 || label.length > 30) {
            return;
        }

        this.inventoryManager.updateMetadata(source, slot, { label: label.replace(WEAPON_NAME_REGEX, '') });
    }

    @OnEvent(ServerEvent.WEAPON_GUNSMITH_APPLY_TINT)
    async applyTint(source: number, slot: number, tint: number) {
        const weapon = this.inventoryManager.getSlot(source, slot);
        if (!weapon) {
            return;
        }

        if (weapon.type !== 'weapon') {
            return;
        }

        this.inventoryManager.updateMetadata(source, slot, { tint: Number(tint) });
    }
}

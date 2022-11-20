import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { WeaponComponentType } from '../../shared/weapons/attachment';
import { InventoryManager } from '../inventory/inventory.manager';

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

    @OnEvent(ServerEvent.WEAPON_GUNSMITH_APPLY_ATTACHMENT)
    async applyAttachment(source: number, slot: number, attachmentType: WeaponComponentType, attachment: string) {
        const weapon = this.inventoryManager.getSlot(source, slot);
        if (!weapon) {
            return;
        }

        if (weapon.type !== 'weapon') {
            return;
        }

        if (weapon.metadata.attachments === undefined) {
            weapon.metadata.attachments = {
                clip: null,
                flashlight: null,
                grip: null,
                scope: null,
                skin: null,
                suppressor: null,
            };
        }

        weapon.metadata.attachments[attachmentType] = attachment;

        this.inventoryManager.updateMetadata(source, slot, { attachments: weapon.metadata.attachments });
    }
}

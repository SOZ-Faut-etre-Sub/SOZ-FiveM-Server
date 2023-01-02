import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcEvent } from '../../shared/rpc';
import { REPAIR_HEALTH_REDUCER, WEAPON_CUSTOM_PRICE, WeaponComponentType } from '../../shared/weapons/attachment';
import { WeaponMk2TintColor, WeaponTintColor } from '../../shared/weapons/tint';
import { GlobalWeaponConfig } from '../../shared/weapons/weapon';
import { InventoryManager } from '../inventory/inventory.manager';
import { PlayerMoneyService } from '../player/player.money.service';

const WEAPON_NAME_REGEX = /([^a-z0-9 ._-]+)/gi;

@Provider()
export class WeaponGunsmithProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Rpc(RpcEvent.WEAPON_SET_LABEL)
    async renameWeapon(source: number, slot: number, label: string): Promise<boolean> {
        const weapon = this.inventoryManager.getSlot(source, slot);
        if (!weapon) {
            return false;
        }

        if (weapon.type !== 'weapon') {
            return false;
        }

        if (label.length < 2 || label.length > 30) {
            return false;
        }

        if (this.playerMoneyService.remove(source, WEAPON_CUSTOM_PRICE.label)) {
            this.inventoryManager.updateMetadata(source, slot, { label: label.replace(WEAPON_NAME_REGEX, '') });
            return true;
        }

        return false;
    }

    @Rpc(RpcEvent.WEAPON_REPAIR)
    async repairWeapon(source: number, slot: number): Promise<boolean> {
        const weapon = this.inventoryManager.getSlot(source, slot);
        if (!weapon) {
            return false;
        }

        if (weapon.type !== 'weapon') {
            return false;
        }

        let maxHealth = weapon.metadata.maxHealth;
        if (!weapon.metadata.maxHealth) {
            maxHealth = GlobalWeaponConfig.MaxHealth;
        }

        let health = weapon.metadata.health;
        if (!weapon.metadata.health) {
            health = GlobalWeaponConfig.MaxHealth;
        }

        const price = WEAPON_CUSTOM_PRICE.repair * Math.floor(100 - (health / maxHealth) * WEAPON_CUSTOM_PRICE.repair);

        if (this.playerMoneyService.remove(source, price)) {
            const heal = maxHealth * REPAIR_HEALTH_REDUCER;

            this.inventoryManager.updateMetadata(source, slot, { maxHealth: heal, health: heal });
            return true;
        }

        return false;
    }

    @Rpc(RpcEvent.WEAPON_SET_TINT)
    async applyTint(source: number, slot: number, tint: WeaponTintColor | WeaponMk2TintColor): Promise<boolean> {
        const weapon = this.inventoryManager.getSlot(source, slot);
        if (!weapon) {
            return false;
        }

        if (weapon.type !== 'weapon') {
            return false;
        }

        if (Number(tint) === 0 && weapon.metadata.tint === undefined) {
            return false;
        }

        if (this.payUpgrade(source, WEAPON_CUSTOM_PRICE.tint, Number(tint) === weapon.metadata.tint)) {
            this.inventoryManager.updateMetadata(source, slot, { tint: Number(tint) });
            return true;
        }

        return false;
    }

    @Rpc(RpcEvent.WEAPON_SET_ATTACHMENTS)
    async applyAttachments(
        source: number,
        slot: number,
        attachmentType: WeaponComponentType,
        attachment: string
    ): Promise<boolean> {
        const weapon = this.inventoryManager.getSlot(source, slot);
        if (!weapon) {
            return false;
        }

        if (weapon.type !== 'weapon') {
            return false;
        }

        if (this.payUpgrade(source, WEAPON_CUSTOM_PRICE.attachment, attachment === null)) {
            if (weapon.metadata.attachments === undefined) {
                weapon.metadata.attachments = {
                    clip: null,
                    flashlight: null,
                    grip: null,
                    scope: null,
                    suppressor: null,
                    primary_skin: null,
                    secondary_skin: null,
                };
            }

            this.inventoryManager.updateMetadata(source, slot, {
                attachments: { ...weapon.metadata.attachments, [attachmentType]: attachment },
            });
            return true;
        }

        return false;
    }

    private payUpgrade(source, price, skipMoneyCheck = false) {
        if (skipMoneyCheck) {
            return true;
        }
        return this.playerMoneyService.remove(source, price);
    }
}

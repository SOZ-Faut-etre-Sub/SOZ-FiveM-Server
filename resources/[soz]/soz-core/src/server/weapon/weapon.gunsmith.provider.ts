import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { TaxType } from '@public/shared/tax';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { REPAIR_HEALTH_REDUCER, WEAPON_CUSTOM_PRICE, WeaponComponentType } from '../../shared/weapons/attachment';
import { WeaponMk2TintColor, WeaponTintColor } from '../../shared/weapons/tint';
import { GlobalWeaponConfig } from '../../shared/weapons/weapon';
import { PlayerMoneyService } from '../player/player.money.service';

const WEAPON_NAME_REGEX = /([^a-z0-9 ._-]+)/gi;

@Provider()
export class WeaponGunsmithProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Rpc(RpcServerEvent.WEAPON_SET_LABEL)
    async renameWeapon(source: number, slot: number, label: string, admin: boolean): Promise<boolean> {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const weapon = inventory.getItemAtSlot(slot);
        if (!weapon) {
            return false;
        }

        if (weapon.type !== 'weapon') {
            return false;
        }

        if (label.length < 2 || label.length > 30) {
            return false;
        }

        if (await this.payUpgrade(source, WEAPON_CUSTOM_PRICE.label, admin)) {
            inventory.updateMetadataAtSlot(slot, { label: label.replace(WEAPON_NAME_REGEX, '') });
            return true;
        }

        return false;
    }

    @Rpc(RpcServerEvent.WEAPON_REPAIR)
    async repairWeapon(source: number, slot: number, admin: boolean): Promise<boolean> {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const weapon = inventory.getItemAtSlot(slot);
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

        const price = WEAPON_CUSTOM_PRICE.repair * Math.floor(100 - (health / maxHealth) * 100);

        if (await this.payUpgrade(source, price, admin)) {
            const heal = maxHealth * REPAIR_HEALTH_REDUCER;

            inventory.updateMetadataAtSlot(slot, { maxHealth: heal, health: heal });
            return true;
        }

        return false;
    }

    @Rpc(RpcServerEvent.WEAPON_SET_TINT)
    async applyTint(
        source: number,
        slot: number,
        tint: WeaponTintColor | WeaponMk2TintColor,
        admin: boolean
    ): Promise<boolean> {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const weapon = inventory.getItemAtSlot(slot);
        if (!weapon) {
            return false;
        }

        if (weapon.type !== 'weapon') {
            return false;
        }

        if (Number(tint) === 0 && weapon.metadata.tint === undefined) {
            return false;
        }

        if (await this.payUpgrade(source, WEAPON_CUSTOM_PRICE.tint, admin || Number(tint) === weapon.metadata.tint)) {
            inventory.updateMetadataAtSlot(slot, { tint: Number(tint) });

            return true;
        }

        return false;
    }

    @Rpc(RpcServerEvent.WEAPON_SET_ATTACHMENTS)
    async applyAttachments(
        source: number,
        slot: number,
        attachmentType: WeaponComponentType,
        attachment: string,
        admin: boolean
    ): Promise<boolean> {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const weapon = inventory.getItemAtSlot(slot);
        if (!weapon) {
            return false;
        }

        if (weapon.type !== 'weapon') {
            return false;
        }

        if (await this.payUpgrade(source, WEAPON_CUSTOM_PRICE.attachment, admin || attachment === null)) {
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

            inventory.updateMetadataAtSlot(slot, {
                attachments: { ...weapon.metadata.attachments, [attachmentType]: attachment },
            });
            return true;
        }

        return false;
    }

    private async payUpgrade(source: number, price: number, skipMoneyCheck = false) {
        if (skipMoneyCheck) {
            return true;
        }

        return this.playerMoneyService.buy(source, price, TaxType.WEAPON);
    }
}

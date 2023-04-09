import { Monitor } from '@public/shared/monitor';

import { On, Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcServerEvent } from '../../shared/rpc';
import { GlobalWeaponConfig, WeaponConfig, Weapons } from '../../shared/weapons/weapon';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';

const DIR_WATER_HYDRANT = 13;

@Provider()
export class WeaponProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.WEAPON_SHOOTING)
    async onWeaponShooting(source: number, weaponSlot: number, weaponGroup: number, playerAmmo: number) {
        const weapon = this.inventoryManager.getSlot(source, weaponSlot);
        if (!weapon) {
            return;
        }

        if (weaponGroup == GetHashKey('GROUP_THROWN') && weapon.metadata.ammo <= 1) {
            this.inventoryManager.removeItemFromInventory(source, weapon.name, 1, weapon.metadata, weaponSlot);
        } else if (weaponGroup == GetHashKey('GROUP_FIREEXTINGUISHER')) {
            this.inventoryManager.updateMetadata(source, weapon.slot, {
                ammo: playerAmmo || 0,
            });
        } else {
            this.inventoryManager.updateMetadata(source, weapon.slot, {
                ammo: weapon.metadata.ammo > 0 ? weapon.metadata.ammo - 1 : 0,
                health: weapon.metadata.health > 0 ? weapon.metadata.health - 1 : 0,
            });
        }
    }

    private async useAmmo(source: number, item: InventoryItem) {
        if (Player(source).state.inv_busy) {
            this.notifier.notify(source, "Inventaire en cours d'utilisation", 'warning');
            return;
        }

        TriggerClientEvent(ClientEvent.WEAPON_USE_AMMO, source, item.name);
    }

    @Rpc(RpcServerEvent.WEAPON_USE_AMMO)
    async onUseAmmo(
        source: number,
        weaponSlot: number,
        ammoName: string,
        ammoInClip: number
    ): Promise<InventoryItem | null> {
        const weapon = this.inventoryManager.getSlot(source, weaponSlot);
        if (!weapon) {
            return;
        }

        const ammo = this.inventoryManager.getItem(source, ammoName);
        if (!ammo) {
            return;
        }

        if (ammo.name !== this.getWeaponConfig(weapon.name)?.ammo) {
            this.notifier.notify(source, 'Vous ne pouvez pas utiliser ces munitions avec cette arme', 'error');
            return;
        }

        if (weapon.metadata.ammo + ammoInClip > ammoInClip * GlobalWeaponConfig.MaxAmmoRefill(weapon.name)) {
            this.notifier.notify(source, 'Vous avez déjà assez de munitions...', 'info');
            return;
        }

        if (!this.inventoryManager.removeItemFromInventory(source, ammo.name, 1, ammo.metadata, ammo.slot)) {
            return;
        }

        this.inventoryManager.updateMetadata(source, weaponSlot, {
            ammo: (weapon.metadata.ammo || 0) + ammoInClip,
        });
        return this.inventoryManager.getSlot(source, weaponSlot);
    }

    @Once(OnceStep.Start)
    public onStart() {
        this.item.setItemUseCallback('ammo_01', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_02', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_03', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_04', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_05', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_06', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_07', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_08', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_09', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_10', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_11', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_12', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_13', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_14', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_15', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_16', this.useAmmo.bind(this));
    }

    private getWeaponConfig(weaponName: string): WeaponConfig | null {
        return Weapons[weaponName.toUpperCase()] ?? null;
    }

    @On('explosionEvent')
    public onExplosion(unk: any, source: number, explosionData) {
        if (explosionData.explosionType == DIR_WATER_HYDRANT) {
            return;
        }

        this.monitor.log('INFO', 'Explosion ' + JSON.stringify(explosionData));
        if (!explosionData.f208) {
            TriggerClientEvent(
                ClientEvent.WEAPON_EXPLOSION,
                source,
                explosionData.posX,
                explosionData.posY,
                explosionData.posZ
            );
        }
    }
}

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcEvent } from '../../shared/rpc';
import { GlobalWeaponConfig, WeaponAmmo } from '../../shared/weapon';
import { InventoryManager } from '../item/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';

@Provider()
export class WeaponProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @OnEvent(ServerEvent.WEAPON_SHOOTING)
    async onWeaponShooting(source: number, weaponSlot: number) {
        const weapon = this.inventoryManager.getSlot(source, weaponSlot);
        if (!weapon) {
            return;
        }

        this.inventoryManager.updateMetadata(source, weaponSlot, {
            ammo: weapon.metadata.ammo - 1,
            health: weapon.metadata.health - 1,
        });
    }

    private async useAmmo(source: number, item: InventoryItem) {
        TriggerClientEvent(ClientEvent.WEAPON_USE_AMMO, source, item.name);
    }

    @Rpc(RpcEvent.WEAPON_USE_AMMO)
    async onUseAmmo(source: number, weaponSlot: number, ammoName: string): Promise<InventoryItem | null> {
        const weapon = this.inventoryManager.getSlot(source, weaponSlot);
        if (!weapon) {
            return;
        }

        const ammo = this.inventoryManager.getItem(source, ammoName);
        if (!ammo) {
            return;
        }

        if (weapon.metadata.ammo >= WeaponAmmo[ammo.name] * GlobalWeaponConfig.MaxAmmoRefill) {
            this.notifier.notify(source, 'Vous avez déjà assez de munitions...', 'info');
            return;
        }

        if (this.inventoryManager.removeItemFromInventory(source, ammo.name, 1, ammo.metadata, ammo.slot)) {
            this.inventoryManager.updateMetadata(source, weaponSlot, {
                ammo: (weapon.metadata.ammo || 0) + WeaponAmmo[ammo.name],
            });
        }

        return this.inventoryManager.getSlot(source, weaponSlot);
    }

    @Once(OnceStep.Start)
    public onStart() {
        this.item.setItemUseCallback('pistol_ammo', this.useAmmo.bind(this));
        this.item.setItemUseCallback('rifle_ammo', this.useAmmo.bind(this));
        this.item.setItemUseCallback('smg_ammo', this.useAmmo.bind(this));
        this.item.setItemUseCallback('shotgun_ammo', this.useAmmo.bind(this));
        this.item.setItemUseCallback('mg_ammo', this.useAmmo.bind(this));
        this.item.setItemUseCallback('snp_ammo', this.useAmmo.bind(this));
    }
}

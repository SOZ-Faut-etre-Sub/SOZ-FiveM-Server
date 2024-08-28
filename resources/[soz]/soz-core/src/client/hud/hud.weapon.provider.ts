import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { WeaponName } from '../../shared/weapons/weapon';
import { InventoryManager } from '../inventory/inventory.manager';
import { NuiDispatch } from '../nui/nui.dispatch';
import { WeaponService } from '../weapon/weapon.service';

@Provider()
export class HudWeaponProvider {
    @Inject(WeaponService)
    private readonly weapon: WeaponService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(InventoryManager)
    private readonly inventoryManager: InventoryManager;

    @Tick(TickInterval.EVERY_FRAME)
    async updateWeaponHud() {
        const player = PlayerPedId();

        const weapon = this.weapon.getCurrentWeapon();
        if (!weapon) {
            this.nuiDispatch.dispatch('hud', 'UpdateWeaponAmmo', {
                hasWeapon: false,
                ammo: 0,
                maxAmmo: 0,
            });
            return;
        }

        if (weapon.name.toLowerCase() === WeaponName.UNARMED.toLowerCase()) {
            return;
        }

        const item = this.inventoryManager.findItem(item => item.type === 'weapon' && item.slot === weapon.slot);

        const ammo = GetAmmoInClip(player, weapon.name)[1] as number;
        const maxAmmo = item.metadata.ammo;

        this.nuiDispatch.dispatch('hud', 'UpdateWeaponAmmo', {
            hasWeapon: maxAmmo !== undefined,
            ammo,
            maxAmmo,
        });
    }
}
